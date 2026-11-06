"""USSD state machine — decides what to show next."""
from __future__ import annotations

from datetime import datetime, timezone

from menus import MENUS, get_symptom_key
from schemas import SessionState
from services import call_prediction_api
from sms import send_prediction_sms

async def handle_input(state: SessionState, user_input: str) -> tuple[SessionState, str, bool]:
    """
    Process user input and return (new_state, menu_text, is_session_end).
    """
    step = state.step
    lang = state.language

    # ---------------- LANGUAGE SELECTION ----------------
    if step == "language":
        if user_input == "1":
            state.language = "en"
            state.step = "main_menu"
            return state, MENUS["main_menu"]["en"], False
        if user_input == "2":
            state.language = "ny"
            state.step = "main_menu"
            return state, MENUS["main_menu"]["ny"], False
        return state, MENUS["invalid"][lang], False

    # ---------------- MAIN MENU ----------------
    if step == "main_menu":
        if user_input == "1":
            state.step = "symptoms_p1"
            return state, MENUS["symptoms_page1"][lang], False
        if user_input == "2":
            state.step = "about"
            return state, MENUS["about"][lang], False
        if user_input == "3":
            return state, MENUS["goodbye"][lang], True
        return state, MENUS["invalid"][lang], False

    # ---------------- ABOUT ----------------
    if step == "about":
        # Any input returns to main menu
        state.step = "main_menu"
        return state, MENUS["main_menu"][lang], False

    # ---------------- SYMPTOM PAGES ----------------
    if step in ("symptoms_p1", "symptoms_p2", "symptoms_p3"):
        page = int(step[-1])  # 1, 2, or 3

        # "0" = next page
        if user_input == "0":
            if page < 3:
                state.step = f"symptoms_p{page + 1}"
                return state, MENUS[f"symptoms_page{page + 1}"][lang], False
            # Page 3 has no "next"
            return state, MENUS["invalid"][lang], False

        # "99" = done (only pages 2 and 3)
        if user_input == "99" and page > 1:
            if not state.symptoms:
                return state, MENUS["invalid"][lang], False
            state.step = "confirm"
            text = MENUS["confirm"][lang].format(count=len(state.symptoms))
            return state, text, False

        # 1-5 = add symptom
        if user_input in ["1", "2", "3", "4", "5"]:
            digit = int(user_input)
            sym_key = get_symptom_key(page, digit)
            if sym_key and sym_key not in state.symptoms:
                state.symptoms.append(sym_key)
            # Re-show the same page
            return state, MENUS[f"symptoms_page{page}"][lang], False

        return state, MENUS["invalid"][lang], False

    # ---------------- CONFIRM ----------------
    if step == "confirm":
        if user_input == "1":
            response = await call_prediction_api(state.symptoms, lang)
            if response is None or not response.top_predictions:
                return state, MENUS["error"][lang], True

            top = response.top_predictions[0]
            confidence = round(top.confidence * 100, 1)
            advice = _short_advice(top.disease, lang)

            text = MENUS["result"][lang].format(
                disease=top.disease.capitalize(),
                confidence=confidence,
                advice=advice,
            )
            state.step = "after_result"
            return state, text, False

        if user_input == "2":
            state.symptoms = []
            state.step = "main_menu"
            return state, MENUS["main_menu"][lang], False

        return state, MENUS["invalid"][lang], False

    # NEW BLOCK: after_result now asks about SMS instead of just ending
    if step == "after_result":
        if user_input == "1":   # "Next" in result screen → SMS prompt
            state.step = "sms_optin"
            return state, MENUS["sms_optin"][lang], False
        if user_input == "2":   # "Start over"
            state.symptoms = []
            state.step = "main_menu"
            return state, MENUS["main_menu"][lang], False
        return state, MENUS["invalid"][lang], False

    # NEW BLOCK: sms_optin
    if step == "sms_optin":
        if user_input == "1":   # Yes, send SMS
            # We NO LONGER call the API. We use what we saved.
            if state.last_disease:
                sms_body = _format_sms(state.last_disease, state.last_confidence, lang)
                sent = send_prediction_sms(state.phone, sms_body)
                
                state.step = "main_menu"
                if sent:
                    return state, MENUS["sms_sent"][lang], False
                else:
                    # If Africa's Talking fails (e.g. wrong phone number)
                    error_msg = "Failed to send SMS. Check your number." if lang == "en" else "Kulephera kutumiza SMS."
                    return state, error_msg, True
            else:
                state.step = "main_menu"
                return state, MENUS["error"][lang], True

        if user_input == "2":   # No, skip SMS
            state.step = "main_menu"
            return state, MENUS["main_menu"][lang], False

        return state, MENUS["invalid"][lang], False

def _short_advice(disease: str, lang: str) -> str:
    """Return a one-line prevention tip suitable for USSD's 182-char limit."""
    tips = {
        "en": {
            "malaria": "Sleep under a net. Seek test if fever persists.",
            "typhoid": "Drink safe water. Wash hands with soap.",
            "tuberculosis": "Get a sputum test. Cover mouth when coughing.",
            "dengue": "Avoid mosquito bites. Rest and hydrate.",
            "hepatitis a": "Rest. Wash hands. Get vaccinated.",
            "hepatitis b": "Get tested. Avoid alcohol.",
            "hepatitis c": "Seek treatment. Avoid alcohol.",
            "hepatitis d": "See specialist. Prevent hepatitis B.",
            "hepatitis e": "Drink safe water. See doctor if pregnant.",
            "gastroenteritis": "Drink ORS. Wash hands. Eat bland food.",
            "pneumonia": "Seek care. Rest. Avoid smoke.",
            "hypothyroidism": "Take thyroid medicine daily. Get tested.",
            "diabetes": "Monitor sugar. Exercise. Take meds.",
            "hypertension": "Reduce salt. Take BP meds. Check BP.",
            "cholera": "Start ORS NOW. Go to clinic URGENTLY.",
        },
        "ny": {
            "malaria": "Gonani mu neti. Yezani ngati kutentha kukupitirira.",
            "typhoid": "Imwani madzi abwino. Sambani manja.",
            "tuberculosis": "Yezani malovu. Phimbani pakamwa.",
            "dengue": "Pewani udzudzu. Pumulani ndi kumwa madzi.",
            "hepatitis a": "Pumulani. Sambani manja. Tembererani.",
            "hepatitis b": "Yezani. Pewani mowa.",
            "hepatitis c": "Funsani chithandizo. Pewani mowa.",
            "hepatitis d": "Onani katswiri. Pewani hepatitis B.",
            "hepatitis e": "Imwani madzi abwino. Onani dokotala.",
            "gastroenteritis": "Imwani ORS. Sambani manja.",
            "pneumonia": "Funsani chithandizo. Pumulani.",
            "hypothyroidism": "Imwani mankhwala tsiku lililonse.",
            "diabetes": "Yang'anirani shuga. Olimpitseni.",
            "hypertension": "Chepetsani mchere. Imwani mankwala a BP.",
            "cholera": "Yambani ORS MSANGA. Pitani ku chipatala.",
        },
    }
    disease_key = disease.lower().strip()
    lang_tips = tips.get(lang, tips["en"])
    return lang_tips.get(disease_key, lang_tips.get("malaria", "Seek medical care."))

def _format_sms(disease: str, confidence: float, lang: str) -> str:
    disease_name = disease.capitalize()
    conf = round(confidence * 100, 1)
    advice = _short_advice(disease, lang)
    return f"Malawi Health AI: {disease_name} ({conf}%). {advice}"