import os
import pandas as pd
import matplotlib.pyplot as plt
from sqlalchemy import create_engine, inspect, text
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import OneHotEncoder
from dotenv import load_dotenv


load_dotenv()

df = pd.read_csv('vgchartz-2024.csv', encoding='latin-1')

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"

engine = create_engine(DATABASE_URL)

inspector = inspect(engine)
if 'games' not in inspector.get_schema_names():
    with engine.connect() as connection:
        connection.execute(text("CREATE SCHEMA games"))
        connection.commit() 

specific_columns = ['title', 'console', 'genre', 'critic_score', 'total_sales']

cutdf = df[specific_columns]

cleaned_df = cutdf.dropna(subset=['title', 'console', 'genre', 'critic_score', 'total_sales'])

cleaned_df.to_sql('dataset', engine, 'games', if_exists='replace', index=False)


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


dftable.columns = ['title', 'console', 'genre', 'critic_score', 'total_sales']


print(dftable.columns)


hitflop_percentile = dftable['total_sales'].quantile(0.75)

dftable['Hit'] = (dftable['total_sales'] >= hitflop_percentile).astype(int)

# Sets feature variables and testing variable
X = dftable[['console', 'genre', 'critic_score']]
y = dftable['Hit']

# initializes encoder
one_hot_encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')

# Translates the console and genre columns from X to their encoded binary versions so each type of row gets their own columns indicating whether a row has that console or genre
X_Encode = one_hot_encoder.fit_transform(X[['console', 'genre']])

# Creates a dataframe with the categories from X_encode and uses them as columns in this dataframe
X_df = pd.DataFrame(X_Encode, columns = one_hot_encoder.get_feature_names_out(['console', 'genre']))

# combines the X_df dataframe with a dataframe made with just the critic_score as a column from the X dftable (and also resets the index while dropping the old index to prevent a misalignment of values)
Xnum = pd.concat([X[['critic_score']].reset_index(drop = True), X_df], axis=1)

# Splits X and y into two datasets used for training and testing with an 75/25 percent split respectively
X_train, X_test, y_train, y_test = train_test_split(Xnum, y, test_size = 0.25, random_state = 42)

# initializes the decision tree and give a maximum depth to the tree
model = DecisionTreeClassifier(max_depth = 6, random_state = 96)
# Trains the model using the training split
model.fit(X_train, y_train)

# Tests the trained model using the X test features and stores the results into y_pred
y_pred = model.predict(X_test)

# Creates a Classification Report and Confusion Matrix showing the True/False Positives/Negatives
print("Classification Report:")
print(classification_report(y_test, y_pred))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

genre_types = dftable.groupby(by='genre').size()
plot = genre_types.plot.bar(x='Genre', ylabel='Count', color='blue')

genre_counts = dftable['genre'].value_counts()
console_counts = dftable['console'].value_counts()

genre_counts.plot(kind='bar', color='skyblue')
console_counts.plot(kind='bar', color='orange')

# Save the plots as images
plt.figure(figsize=(10, 6))
genre_counts.plot(kind='bar', color='skyblue')
plt.title('Distribution of Game Genres')
plt.xlabel('Genre')
plt.ylabel('Number of Games')
plt.xticks(rotation=45)
plt.savefig('../frontend/public/genre_distribution.png')
plt.close()

plt.figure(figsize=(10, 6))
plt.scatter(dftable['critic_score'], dftable['total_sales'], alpha=0.5, color='green')
plt.title('Critic Score vs Total Sales')
plt.xlabel('Critic Score')
plt.ylabel('Total Sales (in millions)')
plt.grid(True)
plt.savefig('../frontend/public/critic_vs_sales.png')
plt.close()

plt.figure(figsize=(10, 6))
console_counts.plot(kind='bar', color='orange')
plt.title('Distribution of Games Across Consoles')
plt.xlabel('Console')
plt.ylabel('Number of Games')
plt.xticks(rotation=45)
plt.savefig('../frontend/public/console_distribution.png')
plt.close()

plt.figure(figsize=(70, 30))
plot_tree(
    model,
    feature_names=Xnum.columns,
    class_names=['Flop', 'Hit'],
    filled=True,
    rounded=True,
    fontsize=10
)
plt.title('Decision Tree Visualization')
plt.savefig('../frontend/public/decision_tree.png')
plt.close()

def predicter(new_game):
    # Creates a new DataFrame with the example
    new_game_df = pd.DataFrame([new_game])

    # applies the fit from the past fit_transform and just transforms the new_game_df categories into binary values with one hot encoding
    new_gamenum = one_hot_encoder.transform(new_game_df[['console', 'genre']])

    # creates a new data frame with the new_gamenum binary values but with categories matching "console" and "genre" as columns
    new_gamenum_df = pd.DataFrame(new_gamenum, columns = one_hot_encoder.get_feature_names_out(['console', 'genre']))

    # Adds the critic score to the prior dataframe while dropping the old index
    newgame_fin = pd.concat([new_game_df[['critic_score']].reset_index(drop = True), new_gamenum_df], axis = 1)

    # Adds a fail-safe in case the prior commands do not change the column names into strings
    newgame_fin.columns = newgame_fin.columns.astype(str)

    # Predicts the result of the new values inputted with the trained model
    prediction = model.predict(newgame_fin)

    # Informs the user if the prediction is a hit or not
    if prediction[0] == 1:
        return "Hit"
    else:
        return "Flop"

