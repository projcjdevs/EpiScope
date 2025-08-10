import pandas as pd 

# Load csv 
df = pd.read_csv("scraped_outbreak.news.csv")

# Strip whitespace from all string 
for col in ['url', 'url_title', 'news_title', 'city']:
    df[col] = df[col].astype(str).str.strip()

# Remove duplicates 
df = df.drop_duplicates()

# Remove missing essential fields 
df = df.dropna(subset=['year', 'total_infected', 'city'])

# Convert year and infected to integers 
df['year'] = pd.to_numeric(df['year'], errors = 'coerce').astype('Int64')
df['total_infected'] = pd.to_numeric(df['total_infected'], errors='coerce').astype('Int64')

# Remove rows where year or total could not be converted 
df = df.dropna(subset=['year', 'total_infected'])

# Reorder columns for clarity 
df = df[['url', 'url_title', 'news_title', 'year', 'total_infected', 'city']]

# Save
df.to_csv("clean_data.csv", index=False)

print("Clean data cv saved as clean_data.csv")
print(df)