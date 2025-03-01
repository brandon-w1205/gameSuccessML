# Game Success Predictor

Link to site: [https://gamesuccess.vercel.app](https://gamesuccess.vercel.app)

This application aims to use machine learning to determine whether or not a game will be a success based off of certain attributes. The machine learning algorithm used is a basic classification decision tree, and the dataset that the application uses is a 2024 Video-Game Sales Dataset from the following link:

[https://www.kaggle.com/datasets/asaniczka/video-game-sales-2024](https://www.kaggle.com/datasets/asaniczka/video-game-sales-2024)

These attributes are as follows:

1. Genre
2. Console
3. Critic Score

A company may use the application as a way to direct a game's development by thinking of a genre and proposed console to develop the game for along with estimating the critic score that it will receive. Alternatively, it can be used as a last check before a game's release once critic scores have been officially received by reviewers.

Features:

* Custom Title and Critic Score Input
* Back to Beginning Button
* Preset Genres and Console Platforms
* Data Visualizations
* Decision-Tree machine learning
* Frontend hosted on Vercel
* Backend hosted on Render
* Database hosted on Supabase

How to use the Application:

1. Click on the link
2. Type in a Title for your game. Click Next or press Enter
3. Select a Genre.
4. Select a Console.
5. Type in a Critic Score. Click Submit or press Enter.
6. Optional: Click on the Decision Tree Distribution to enlarge the image. Click on it again to reduce the image to its normal size.

Note: Some visualizations may not be rendered immediately upon entering the website. This is due to the backend needing to process the decision tree. Please wait a few seconds for the images to load.
