import time
from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

def scrape_google_maps(speciality, location, headless=False):

    def parse_contact(business):
        try:
            contact = business.find_elements(By.CLASS_NAME, "W4Efsd")[3].text.split("·")[-1].strip()
        except:
            contact = ""

        if "+1" not in contact:
            try:
                contact = business.find_elements(By.CLASS_NAME, "W4Efsd")[4].text.split("·")[-1].strip()
            except:
                contact = ""

        return contact

    def parse_rating_and_review_count(business):
        try:
            reviews_block = business.find_element(By.CLASS_NAME, 'AJB7ye').text.split("(")
            rating = reviews_block[0].strip()
            reviews_count = reviews_block[1].split(")")[0].strip()
        except:
            rating = ""
            reviews_count = ""

        return rating, reviews_count

    def parse_address_and_category(business):
        try:
            address_block = business.find_elements(By.CLASS_NAME, "W4Efsd")[2].text.split("·")
            if len(address_block) >= 2:
                address = address_block[1].strip()
                category = address_block[0].strip()
            elif len(address_block) == 1:
                address = ""
                category = address_block[0]
        except:
            address = ""
            category = ""

        return address, category

    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless")
    s = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=s, options=options)

    url = f"https://www.google.com/maps/search/{speciality}+in+{location}/"
    
    print("Getting business info", url)
    driver.get(url)
    time.sleep(5)
    panel_xpath = '//*[@id="QA0Szd"]/div/div/div[1]/div[2]/div/div[1]/div/div/div[2]/div[1]'
    scrollable_div = driver.find_element(By.XPATH, panel_xpath)

    unique_check = []
    business_data = [] 

    flag = True
    i = 0
    while flag:
        print(f"Scrolling to page {i + 2}")
        driver.execute_script('arguments[0].scrollTop = arguments[0].scrollHeight', scrollable_div)
        time.sleep(4)

        if "You've reached the end of the list." or "Стигнахте до края на списъка." in driver.page_source:
            flag = False

        time.sleep(2)
        for business in driver.find_elements(By.CLASS_NAME, 'THOPZb'):
            name = business.find_element(By.CLASS_NAME, 'fontHeadlineSmall').text
            rating, reviews_count = parse_rating_and_review_count(business)
            address, category = parse_address_and_category(business)
            contact = parse_contact(business)
            try:
                website = business.find_element(By.CLASS_NAME, "lcr4fd").get_attribute("href")
            except NoSuchElementException:
                website = ""

            unique_id = "".join([name, rating, reviews_count, address, category, contact, website])
            if unique_id not in unique_check:
                business_data.append({
                    'name': name,
                    'rating': rating,
                    'reviews_count': reviews_count,
                    'address': address,
                    'category': category,
                    'contact': contact,
                    'website': website
                })
                unique_check.append(unique_id)

        i += 1

    return business_data
