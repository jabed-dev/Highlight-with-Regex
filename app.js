const hlHTML = require('./hlHTML')

let html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1 id="head" class="hl-html" style="font-family: Arial, Helvetica, sans-serif;">Highlight HTML</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus autem libero sapiente!</p>
    <select name="select" id="select-option">
        <option value="item" selected>item1</option>
        <option value="item">item1</option>
        <option value="item">item1</option>
        <option value="item">item1</option>
    </select>
</body>

</html>
`


console.log(hlHTML(html))
