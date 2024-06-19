<img width="498" alt="image" src="https://github.com/ReyhanDzaki/NusantaraValor/assets/100507045/079fb16c-9d4b-4081-a8dd-98f9e4fddfd2">
# Nusantara Valor 

Hello visitor!
Nusantara Valor is a group that is consisted of 4 people for the AI branch, lets meet our team

## The Team

- [@reyhandzaki](https://github.com/ReyhanDzaki)
- [@afifnasrulloh](https://github.com/ReyhanDzaki)
- [@iffoels](https://github.com/ReyhanDzaki)
- [@pitri](https://github.com/ReyhanDzaki)


## The Project

#### **What is it?** 
 The project is an eventual app called BerkasBerkah which is a solution for people in Bandung to mitigate waste. By using this app they can sell or give their second use item away!

#### **How does it work?** 
Users would scan their second hand items so that our Artificial Intelligence could do its magic and see is your item fit for the website or not!

#### **How did we do it?** 
The project began when we collected data from the web through sites such as facebook marketplace, reddit, quora, pinterest, and such to seek bad quality items. After that we preprocess the data by zooming in to the object or by cropping unwanted background. Then roboflow augments our dataset so the model could learn from more pictures. After that, the model was deployes inside of the roboflow API! which you can demo by running just the **HTML** of the file.
## API Reference

#### Get AI response

```javascript
$(function() {
	//values pulled from query string
	$('#model').val("classgarbage");
	$('#version').val("2");
	$('#api_key').val("zHAUzLCR1emSoJVrOiFj");

```

#### Explanation
The code above uses roboflows api to return the classification of the picture that is sent! You can use the API freely!

## The Result

<img width="533" alt="image" src="https://github.com/ReyhanDzaki/NusantaraValor/assets/100507045/57523b0d-e214-4653-bb37-f519f1d16a23">

#### Explanation!
Through the image we can tell that the item is layak or feasible!
