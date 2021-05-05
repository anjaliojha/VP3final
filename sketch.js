var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var updateGameState, readGameState;
var bedroom, garden, washroom;
var bedroomIMG, gardenIMG, washroomIMG;
var gameState
//create feed and lastFed variable here
var feed,lastFeed,lastFed;


function preload(){
sadDog=loadImage("dogImg.png");
happyDog=loadImage("dogImg1.png");
bedroomIMG = loadImage("Bed Room.png");
gardenIMG = loadImage("Garden.png");
washroomIMG = loadImage("Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
 
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  feedTheDog=createButton("feed dog");
  feedTheDog.position(700,95);
  feedTheDog.mousePressed(feedDog);


  readState = database.ref('gameState');
  readState.on("value", function(data){
  gameState = data.val();
  })
}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  fedTime = database.ref("feedTime");
  fedTime.on("value",function(data){
    lastFed = data.val();
  })
 
  //write code to display text lastFed time here
  textSize(20);
  fill("red");
   if(lastFed>=12){
     text("last feed : "+lastFed%12+"PM",350,30);
   }else if(lastFed==0){
     text("last Feed : 12 AM",350,30);
   }else{
    text("last feed : "+lastFed+"PM",350,30);

   }
 if(gameState!="Hungry"){
  feedTheDog.hide();
   addFood.hide();
   dog.remove();

 }
 else{
   feedTheDog.show();
   addFood.show();
   dog.addImage(sadDog)
 }
 
 currentTime = hour();
 if(currentTime==(lastFed+1)){
   update("Playing");
   foodObj.garden();
 }
 else if(currentTime==(lastFed+2)){
   update("Sleeping");
   foodObj.bedroom();

 }
 else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
   update("Bathing");
   foodObj.washroom();

 }
 else{
   update("Hungry");
   foodObj.display();
 }


 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  var foodStockValue = foodObj.getFoodStock();
  if(foodStockValue <= 0){
    foodObj.updateFoodStock(foodStockValue*0);
    } 
    else{
      foodObj.updateFoodStock(foodStockValue-1);
    }   
  database.ref("/").update({
    food:foodObj.getFoodStock(),
    feedTime:hour(),
    gameState:"Hungry"
  });

  

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
 
function update(state){
  database.ref('/').update({
    gameState:state
  });
}


