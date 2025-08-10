import re
import pandas as pd
from bs4 import BeautifulSoup
import requests

def scrape_outbreak_news(url):
    """Scrape outbreak data from a news/article.page"""
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Title of URL (web page)
    url_title = soup.title.string.strip() if soup.title else ""

    # News headline 
    news_title = ""
    h1 = soup.find("h1") # Usually in h1 
    if h1:
        news_title = h1.get_text(strip=True)
    else: 
        news_title = url_title

    # Gets the year from the URL 
    text = soup.get_text()
    year_match = re.search(r"\b(20\d{2}|19\d{2})\b", text) # Finds the 4 digit number that looks like a year
    year = year_match.group(0) if year_match else ""

    # Finds the total infected
    infected_match = re.search(r"([\d,]+)\s+(cases?|infected|patients?)", text, re.IGNORECASE)
    total_infected = infected_match.group(1).replace(",", "") if infected_match else ""

    # City
    cities= [
        "Manila", "Quezon City", "Cebu City", "Davao City", "Zamboanga City", "Taguig", "Pasig", "Caloocan",
        "Makati", "Pasay", "Baguio", "Iloilo City", "Cagayan de Oro", "Bacolod", "Mandaluyong"
    ]

    city_found = ""
    for city in cities: 
        if re.search(r"\b{}\b".format(re.escape(city)), text):
            city_found = city
            break
    
    return {
        "url": url,
        "url_title": url_title,
        "news_title": news_title,
        "year": year,
        "total_infected": total_infected,
        "city": city_found
    }

if __name__ == "__main__":
    # Ad URL here 
    urls = [
        "https://quezoncity.gov.ph/quezon-city-leads-fight-against-hiv-aids-amid-national-surge-in-cases/"
        # Can add more 
    ]

    results = []
    for url in urls: 
        data = scrape_outbreak_news(url)
        print(data)
        results.append(data)

        # Save results to CSV
        df = pd.DataFrame(results)
        df.to_csv("scraped_outbreak.news.csv", index = False)