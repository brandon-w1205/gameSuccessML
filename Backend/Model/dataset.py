import pandas as pd
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import OneHotEncoder



df = pd.read_csv('vgchartz-2024.csv', encoding='latin-1')

DATABASE_URI = 'postgresql+psycopg2://postgres:postgres@localhost:5432/gamesuccessml'

engine = create_engine(DATABASE_URI)

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


hitflop_percentile = dftable['total_sales'].quantile(0.75)

dftable['Hit'] = (dftable['total_sales'] >= hitflop_percentile).astype(int)

X = dftable[['console', 'genre', 'critic_score']]
y = dftable['Hit']


one_hot_encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')

X_Encode = one_hot_encoder.fit_transform(X[['console', 'genre']])

X_df = pd.DataFrame(X_Encode, columns = one_hot_encoder.get_feature_names_out(['console', 'genre']))

Xnum = pd.concat([X[['critic_score']].reset_index(drop = True), X_df], axis=1)


X_train, X_test, y_train, y_test = train_test_split(Xnum, y, test_size = 0.2, random_state = 42)

model = DecisionTreeClassifier(max_depth = 5, random_state = 42)
model.fit(X_train, y_train)


y_pred = model.predict(X_test)
print("Classification Report:")
print(classification_report(y_test, y_pred))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))


new_game = {
    'console': 'PS4',
    'genre': 'Action',
    'critic_score': 85
}
new_game_df = pd.DataFrame([new_game])

# new_game_df = new_game_df[['console', 'genre', 'critic_score']]
new_gamenum = one_hot_encoder.transform(new_game_df[['console', 'genre']])

new_gamenum_df = pd.DataFrame(new_gamenum, columns = one_hot_encoder.get_feature_names_out(['console', 'genre']))

newgame_fin = pd.concat([new_game_df[['critic_score']].reset_index(drop = True), new_gamenum_df], axis = 1)

# prediction = model.predict(new_game_df)
prediction = model.predict(newgame_fin)

print("Prediction: Hit" if prediction[0] == 1 else "Prediction: Flop")

print(dftable)


