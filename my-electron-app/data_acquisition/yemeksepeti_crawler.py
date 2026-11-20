import chompjs
import requests
from bs4 import BeautifulSoup


def fix_encoding(value):
    if not isinstance(value, str):
        return value
    try:
        return value.encode("latin1").decode("utf-8")
    except UnicodeError:
        return value


def crawl(url):
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers, timeout=10)

    response.raise_for_status()

    html = response.text

    soup = BeautifulSoup(html, "html.parser")

    for script in soup.find_all("script"):
        try:
            res_json = chompjs.parse_js_object(script.get_text())

            if (
                isinstance(res_json, dict)
                and "apollo" in res_json
                and "initialState" in res_json["apollo"]
            ):
                initial_state = res_json["apollo"]["initialState"]
                root_query = initial_state["ROOT_QUERY"]

                restaurant_details = root_query[
                    next(key for key in root_query if key.startswith('restaurantDetailsPage'))
                ]
                
                vendor_data = restaurant_details['vendorData']
                
                restaurant_name = fix_encoding(vendor_data['name'])
                
                menu_reference = vendor_data[
                    'menu({"restaurantMenuFilter":{"expeditionType":"DELIVERY"}})'
                ]
                
                menu_original = initial_state[menu_reference["__ref"]]
                
                menu = []

                categories_references = menu_original["categories"]
                for i in range(len(categories_references)):
                    category = initial_state[categories_references[i]["__ref"]]
                    menu_item = {}
                    menu_item["category_name"] = fix_encoding(category["title"])
                    products = []

                    products_reference = category["products"]
                    for j in products_reference:
                        product = {}

                        item = initial_state[j["__ref"]]

                        product["name"] = fix_encoding(item["title"])
                        product["description"] = fix_encoding(item.get("description"))
                        product["category"] = fix_encoding(category["title"])
                        product["price"] = item["priceAttributes"]["originalPrice"]
                        product["is_available"] = not item["isSoldOut"]
                        product["image_url"] = (item.get("image") or {}).get("url")

                        products.append(product)

                    menu_item["products"] = products
                    menu.append(menu_item)

                # print(json.dumps(menu, indent=4, ensure_ascii=False), file=f)

        except ValueError:
            continue
    return {
        "restaurant_name" : restaurant_name, 
        "menu" : menu
        }
    


url = "https://www.yemeksepeti.com/restaurant/zg4a/beykoz"
#url = "https://www.yemeksepeti.com/restaurant/g2yx/maydonoz-doner-g2yx"

restaurant_data = crawl(url)


