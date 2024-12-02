# particleSpirales

Generates spirals by setting specific points. Then does a smooth zoom-out.

![spiral](https://github.com/user-attachments/assets/7ced7827-0cfd-46dd-994d-0a8ba426d50c)


## How to run ##

- Check if three.js and parcel are installed:

```
npm list
```

We use _parcel_ as a almost zero config build tool. Install parcel in your working directory:

```
npm install --save-dev parcel
```

Install _three_ with 

```
npm install three
```

- Ensure to add "source": "index.html" in the package.json file of your project.

- Now **run the server** through with a simple parcel command in your project directory:

```
npx parcel index.html 
```

Parcel will announce "Server running at http://localhost:1234" and will hotload all your changes immediately.

