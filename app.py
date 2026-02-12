from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

expenses = []

def categorize(description):
    desc = description.lower()

    food_keywords = [
        "food", "meal", "lunch", "dinner", "breakfast", "snacks",
        "pizza", "burger", "sandwich", "biryani", "rice", "roti",
        "hotel", "restaurant", "dhaba", "canteen", "mess",
        "swiggy", "zomato", "ubereats", "eatfit", "box8",
        "chai", "tea", "coffee", "juice", "shake",
        "bakery", "cake", "pastry", "ice cream", "sweet",
        "paratha", "dosa", "idli", "vada", "samosa"
    ]

    travel_keywords = [
        "travel", "ride", "trip", "journey",
        "uber", "ola", "rapido", "inride",
        "auto", "rickshaw", "cab", "taxi",
        "car", "bike", "scooter",
        "bus", "metro", "train", "local", "rail",
        "flight", "air", "airport",
        "petrol", "diesel", "fuel", "gas",
        "parking", "toll", "service", "repair"
    ]

    rent_keywords = [
        "rent", "pg", "hostel", "room", "flat", "apartment",
        "house", "accommodation",
        "maintenance", "society",
        "electricity", "current bill", "power bill",
        "water bill", "gas bill",
        "internet", "wifi", "broadband", "dth", "recharge"
    ]

    entertainment_keywords = [
        "movie", "cinema", "theatre", "film",
        "netflix", "prime", "hotstar", "sony liv",
        "spotify", "wynk", "gaana",
        "game", "gaming", "playstation", "xbox",
        "concert", "event", "show"
    ]

    shopping_keywords = [
        "shopping", "mall", "store",
        "amazon", "flipkart", "myntra", "ajio",
        "meesho", "nykaa",
        "clothes", "dress", "shirt", "pant", "jeans",
        "shoes", "footwear", "sneakers",
        "bag", "watch", "accessories"
    ]

    health_keywords = [
        "hospital", "clinic", "doctor", "medical",
        "medicine", "tablet", "capsule", "syrup",
        "pharmacy", "apollo", "1mg", "pharmeasy",
        "health", "checkup", "test", "scan"
    ]

    education_keywords = [
        "college", "school", "tuition", "fees",
        "course", "class", "training",
        "udemy", "coursera", "byjus", "unacademy",
        "exam", "books", "book", "stationery",
        "pen", "notebook"
    ]

    lifestyle_keywords = [
        # smoking
        "cigarette", "cigarettes", "cig", "cigs",
        "smoke", "smoking", "beedi", "bidi",
        "vape", "vaping", "hookah", "sheesha",
        "lighter", "rolling paper",

        # alcohol / drinking
        "alcohol", "drink", "drinks", "drinking",
        "beer", "wine", "whisky", "whiskey",
        "vodka", "rum", "gin", "tequila",
        "bar", "pub", "club", "liquor", "wine shop"
    ]

    # Priority-based categorization
    if any(word in desc for word in food_keywords):
        return "Food"
    elif any(word in desc for word in travel_keywords):
        return "Travel"
    elif any(word in desc for word in rent_keywords):
        return "Rent"
    elif any(word in desc for word in lifestyle_keywords):
        return "Lifestyle"
    elif any(word in desc for word in entertainment_keywords):
        return "Entertainment"
    elif any(word in desc for word in shopping_keywords):
        return "Shopping"
    elif any(word in desc for word in health_keywords):
        return "Health"
    elif any(word in desc for word in education_keywords):
        return "Education"
    else:
        return "Others"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/add-expense", methods=["POST"])
def add_expense():
    data = request.json

    expense = {
        "amount": int(data["amount"]),
        "description": data["description"],
        "category": categorize(data["description"])
    }

    expenses.append(expense)
    return jsonify(expenses)

@app.route("/get-expenses")
def get_expenses():
    return jsonify(expenses)

if __name__ == "__main__":
    app.run(debug=True)
