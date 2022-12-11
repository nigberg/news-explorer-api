# News Explorer project  
The API backend part of NewsExplorer project  

### Supported routes: 

POST /signup - for new user registration  
(Expected data: email, name, password)  

POST /signin - for authorization with email and password  

GET /users/me - returns current authirized user data  

GET /articles - returns all saved news articles saved by current user  

POST /articles - to create new article  

DELETE /articles/:articleId - to remove existing saved article by ID  

### Author: 
_Meir Nigberg_  

### IDE I used: 
_VS Code_  

### Technologies I used:  

_NodeJS_  
_ExpressJS_  
_MongoDB_  

[Link to deployed API](https://api.nigberg-news.students.nomoredomainssbs.ru)
