import requests

def fetch_product_data(barcode):
    url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}"
    headers = {
        "User-Agent": "MyBarcodeApp/1.0 (wallaag@pedarecc.sa.edu.au)"
    }
    response = requests.get(url, headers=headers)
    return response.json()

def get_recommendation(grade, sugars):
    if grade is not None:
        grade = grade.upper()
        if grade == "A":
            return "Nutri-Score A: Healthy choice!"
        elif grade == "B":
            return "Nutri-Score B: Good choice."
        elif grade == "C":
            return "Nutri-Score C: Okay in moderation."
        elif grade == "D":
            return "Nutri-Score D: Limit your intake."
        elif grade == "E":
            return "Nutri-Score E: Consume in moderation."
    
    if sugars is not None:
        if sugars <= 5:
            return f"Low sugar ({sugars} g/100g): Healthy choice!"
        elif sugars <= 22.5:
            return f"Moderate sugar ({sugars} g/100g): Okay in moderation."
        else:
            return f"High sugar ({sugars} g/100g): Consume in moderation."
            
    return "No Nutri-Score or sugar data available."

def check_carbohydrates(carbs):
    if carbs is None:
        return "Carbohydrate data not available."
    if carbs < 100:
        return f"Carbohydrates are below 100g (Total: {carbs}g)."
    else:
        return f"Carbohydrates are 100g or above (Total: {carbs}g)."

def print_product_info(data):
    if data.get("status") != 1:
        print("Product not found or invalid barcode.")
        return

    product = data.get("product", {})
    nutriments = product.get("nutriments", {})

    name = product.get("product_name", "Unknown Name")
    brand = product.get("brands", "Unknown Brand")
    grade = product.get("nutriscore_grade")
    sugar = nutriments.get("sugars_100g")
    carbs = nutriments.get("carbohydrates_100g")
    energy = nutriments.get("energy-kcal_100g", "Unknown Energy")

    print(f"\nProduct Name: {name}")
    print(f"Brand: {brand}")
    print(f"Energy: {energy} kcal/100g")
    print(get_recommendation(grade, sugar))
    print(check_carbohydrates(carbs))
    print("-" * 25)

def print_menu():
    print("\n1. Enter your own barcode")
    print("2. Explore 3 sample products")
    print("3. Exit")

def main():
    while True:
        print_menu()
        choice = input("Enter your choice: ")
        
        if choice == "1":
            barcode = input("Enter a barcode: ")
            if not barcode.isdigit():
                print("Invalid input. Please enter numbers only.")
                continue
            
            data = fetch_product_data(barcode)
            print_product_info(data)
            
        elif choice == "2":
            print("\nChoose a product to explore:")
            print("1. Nutella")
            print("2. Coca-Cola Original")
            print("3. Oreo Biscuits")
            
            sub_choice = input("Enter 1, 2, or 3: ")
            
            if sub_choice == "1":
                data = fetch_product_data("3017620422003")
                print_product_info(data)
            elif sub_choice == "2":
                data = fetch_product_data("5449000000996")
                print_product_info(data)
            elif sub_choice == "3":
                data = fetch_product_data("7622210449283")
                print_product_info(data)
            else:
                print("Invalid product choice.")
                
        elif choice == "3" or choice.lower() == "exit":
            print("Goodbye!")
            break
            
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()