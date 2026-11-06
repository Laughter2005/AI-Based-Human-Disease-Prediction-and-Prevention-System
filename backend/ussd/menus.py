"""USSD menu content — bilingual."""
from __future__ import annotations


MENUS = {
    # ---------------- LANGUAGE SELECTION ----------------
    "language": {
        "en": "Malawi Health AI\nCheck symptoms. Get guidance.\n\n1. English\n2. Chichewa",
        "ny": "Malawi Health AI\nYang'ana zizindikiro.\n\n1. Chingerezi\n2. Chichewa",
    },

    # ---------------- MAIN MENU ----------------
    "main_menu": {
        "en": "Main menu:\n1. Check symptoms\n2. About\n3. Exit",
        "ny": "Choyambirira:\n1. Yang'ana zizindikiro\n2. Za Ife\n3. Tulukani",
    },

    # ---------------- ABOUT ----------------
    "about": {
        "en": "Malawi Health AI uses AI to suggest possible conditions from your symptoms. NOT a medical diagnosis. Dial back to start.",
        "ny": "Malawi Health AI imagwiritsa ntchito AI kulosera matenda kutengera zizindikiro. SI kuyeza kwa dokotala. Imbaninso kuyamba.",
    },

    # ---------------- SYMPTOM SELECTION (15 curated) ----------------
    "symptoms_page1": {
        "en": "Select symptom (1/3):\n1. Fever\n2. Headache\n3. Cough\n4. Vomiting\n5. Diarrhoea\n0. Next page",
        "ny": "Sankhani zizindikiro (1/3):\n1. Kutentha thupi\n2. Mutu\n3. Chifuwa\n4. Kusanza\n5. Kutsegula\n0. Tsamba lina",
    },
    "symptoms_page2": {
        "en": "Select symptom (2/3):\n1. Fatigue\n2. Chills\n3. Body aches\n4. Sore throat\n5. Runny nose\n0. Next page\n99. Done",
        "ny": "Sankhani zizindikiro (2/3):\n1. Kutopa\n2. Kuzizira\n3. Kupweteka thupi\n4. Khosi\n5. Chimfine\n0. Tsamba lina\n99. Zatha",
    },
    "symptoms_page3": {
        "en": "Select symptom (3/3):\n1. Weight loss\n2. Night sweats\n3. Yellow eyes\n4. Chest pain\n5. Stomach pain\n99. Done",
        "ny": "Sankhani zizindikiro (3/3):\n1. Kuonda\n2. Thukuta usiku\n3. Maso achikasu\n4. Chifuwa\n5. Mimba\n99. Zatha",
    },

    # ---------------- CONFIRM ----------------
    "confirm": {
        "en": "You selected {count} symptom(s).\n1. Get prediction\n2. Add more\n3. Start over",
        "ny": "Mwasankha zizindikiro {count}.\n1. Pezani zotsatira\n2. Onjezani\n3. Yambaninso",
    },

    # ---------------- PREDICTION RESULT ----------------
    "result": {
        "en": "{disease} ({confidence}% confidence)\n\n{advice}\n\n1. Next\n2. Start over",
        "ny": "{disease} ({confidence}%)\n\n{advice}\n\n1. Kutsatira\n2. Yambaninso",
    },

    # ---------------- ERRORS / ENDS ----------------
    "invalid": {
        "en": "Invalid option. Please reply with a number from the list.",
        "ny": "Chosankha cholakwika. Chonde yankhani ndi nambala kuchokera m'ndandanda.",
    },
    "error": {
        "en": "Sorry, something went wrong. Please try again later.",
        "ny": "Pepani, china chake chalakwika. Chonde yesaninso pambuyo pake.",
    },
    "goodbye": {
        "en": "Thank you for using Malawi Health AI. Stay healthy!",
        "ny": "Zikomo pogwiritsa ntchito Malawi Health AI. Khalani wathanzi!",
    },
        
    "sms_optin": {
            "en": "Receive result by SMS?\n1. Yes\n2. No",
            "ny": "Landirani zotsatira pa SMS?\n1. Inde\n2. Ayi",
    },
    "sms_sent": {
           "en": "Result sent to your phone by SMS. Stay healthy!",
           "ny": "Zotsatira zatumizidwa pa foni yanu. Khalani wathanzi!",
    },
}


# Curated symptom keys — these MUST match the model's training vocabulary
SYMPTOM_KEYS_PAGE1 = ["fever", "headache", "cough", "vomiting", "diarrhoea"]
SYMPTOM_KEYS_PAGE2 = ["fatigue", "chills", "body_pains", "throat_irritation", "runny_nose"]
SYMPTOM_KEYS_PAGE3 = ["weight_loss", "sweating", "yellowing_of_eyes", "chest_pain", "stomach_pain"]


def get_symptom_key(page: int, digit: int) -> str | None:
    """Map (page, digit) → symptom key. Returns None if invalid."""
    mapping = {1: SYMPTOM_KEYS_PAGE1, 2: SYMPTOM_KEYS_PAGE2, 3: SYMPTOM_KEYS_PAGE3}
    keys = mapping.get(page)
    if not keys or digit < 1 or digit > 5:
        return None
    return keys[digit - 1]