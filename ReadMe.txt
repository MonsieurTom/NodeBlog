--Installation process:

- Used database: MongoDB.

The database is in the Dump folder under awesome-blog folder.

to add the database insert: C:/mongoDB/mongorestore.exe -h localhost ~/project/Dump/awesome-blog

- launch the web site:

open a shell (powershell for windows) and enter the comment > "npm start"

connect to localhost:3000

--Functionnalities:
-front page:
last 10posts as previews, click on the title or the read more button to access the whole post.

-All page:
All the posts from the first to the last post (10 post displayed per page)

-Account system:
You can login or create an account, only logged user can create a new blog post and only the author of a post or the admin can delete/edit it.

-Quill:
The creation of blog post use a sublime text edit named Quill, you can post youtube link, images(animated gifs work), etc...

-- accounts:
- Admin account:
Id: Admin
password: Admin

- Others:
- Test account:
Id: test
password: test

-Test2 account:
Id: test2
password: test
