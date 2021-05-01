var dog, dogImg
var happyDog, happyDogImg
var database;
var foodS;
var foodStock;
var FedTime, lastFed;
var foodObj;
function preload()
{
	dogImg=loadImage("dogImg.png");
  happyDogImg=loadImage("dogImg1.png");
}

function setup() {
	createCanvas(500, 500);

  foodObj = new Food();
  dog=createSprite(200,200,10,10);
 dog.addImage(dogImg);
 dog.scale=0.2;

  database=firebase.database();
  foodStock=database.ref('food');

  foodStock.on("value", readStock);

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePresses(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousepressed(addFoods);
}


function draw() {  
  background((46, 139, 87));
foodObj.display();
fedTime = database.ref('FeedTime');
fedTime.on("value",function(data){
lastFed=data.val();
});


textSize(5);
fill("red");
stroke(5);
textSize(20);
text("Food remaining : "+foodS,170,50);

drawSprites();
}
function addFood(){
   foodS++;
   database.ref('/').update({
     Food:foodS
   });
}
function readStock(data){
  foodS=data.val();

}

 




