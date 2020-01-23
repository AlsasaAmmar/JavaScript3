<html lang="en">

  <head>
    <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
          <title>Programmer hummer</title>
</head>

        <body>



          <script>
            // request using XMLHttpRequest 
            const xhr = new XMLHttpRequest();
            const url = 'https://xkcd.com/info.0.json';
            xhr.responseType = 'json';
             xhr.onload = function () {
            if (xhr.status != 200) {
            if (xhr.status >= 400 && xhr.status <= 500) {
              console.log('Check your code something wrong with the request!');
        } else {
              console.log('You have done what you can but the server is not responding! ');
          }
      } else {
              console.log(xhr.response);
          };
        }
        xhr.open('GET', url);
        xhr.send();
    
        // using axios
    
        axios.get(url)
      .then(function (response) {
              // handle success
              console.log(response);
            console.log(response.data);
          })
      .catch(function (error) {
              // handle error
              console.log(error);
          })
      .then(function () {
              // always executed

            });
      
      
  </script>

        </body>

</html>