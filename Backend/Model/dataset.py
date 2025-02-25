import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sklearn.model_selection import train_test_split


df = pd.read_csv('vgchartz-2024.csv', encoding='latin-1')

DATABASE_URI = 'postgresql+psycopg2://postgres:postgres@localhost:5432/gamesuccessml'

engine = create_engine(DATABASE_URI)

specific_columns = ['title', 'console', 'genre', 'critic_score', 'total_sales']

cutdf = df[specific_columns]

cleaned_df = cutdf.dropna(subset=['title', 'console', 'genre', 'critic_score', 'total_sales'])

cleaned_df.to_sql('dataset', engine, 'games', if_exists='replace', index=False)

session = Session(engine)

dftable = pd.read_sql_table(
    "dataset",
    con=engine,
    schema='games',
    columns=[
        'title',
        'console',
        'genre',
        'critic_score',
        'total_sales'
    ]
)

X = dftable.drop(columns=['title', 'total sales'])

hitfloppercentile = dftable['total_sales'].quantile(0.75)


print(dftable)


