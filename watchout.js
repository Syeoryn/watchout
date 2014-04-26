// start slingin' some d3 here.

var options ={
  width : 960,
  height : 750,
  enemies: 42,
  enemyRadius: 10
};

var stats = {
  current: 0,
  highScore: 0,
  collisions: 0
}

// Define game board
var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,options.width]),
  y: d3.scale.linear().domain([0,100]).range([0,options.height])
};

var board = d3.select("body").append("svg")
              .attr("class", "board")
              .style("width", options.width)
              .style("height", options.height)
              .style("background-color", "black");


// Create player
var playerSpecs = {
  shape: "path",
  path:   "M 9  1"
        + "L 17 26"
        + "L 9  22"
        + "L 1  26"
        + "L 9  1",
  id: 0
};

// Add player to board
var playerContainer = board.append("svg:svg")
                           .attr("class","playerContainer")
                           .attr("width","20")
                           .attr("height","28")
                           .attr("x",options.width/2)
                           .attr("y",options.height/2);

var player = board.selectAll(".player").data([player]);

playerContainer.append("svg:" + playerSpecs.shape)
               .attr("d",playerSpecs.path)
               .attr("class","player")
               .attr("stroke","#00D000")
               .attr("stroke-opacity",1e-6)
               .attr("stroke-width", 1e-6)
               .attr("fill","#00D000")
               .attr("fill-opacity",1e-6)
             .transition()
               .attr("fill-opacity",0.25)
               .duration(1500)
               .attr("stroke-opacity",1)
               .attr("stroke-width",2);

// Give player click and drag capability
var drag = d3.behavior.drag().on("drag",function(){
  d3.select(this)
    .attr("x",function(){return d3.event.x;})
    .attr("y",d3.event.y);
});

d3.select(".playerContainer").call(drag);


// Create enemies
var makeEnemies = function(){
  var enemyIds = [];
  for(var enemy = 1; enemy <= options.enemies; enemy++){
    enemyIds.push(enemy);
  }
  return enemyIds;
};

var enemyIds = makeEnemies;

var enemies = board.selectAll(".enemy")
                   .data(enemyIds,function(id){return id;});

// Add enemies to board
enemies.enter().append("svg:circle")
       .attr("class","enemy")
       .attr("stroke","#00A000")
       .attr("r", 0)
       .attr("cx", function(){return Math.random() * options.width;})
       .attr("cy", function(){return Math.random() * options.height;})
       .attr("stroke-opacity",1e-6)
       .attr("stroke-width", 1e-6)
       .attr("fill","none")
    .transition()
       .duration(3000)
       .attr("r",15)
       .attr("stroke-opacity",1)
       .attr("stroke-width",1.1);

enemies.attr("x",function(id){
  return 10 * id;
});

// Allow enemies to move randomly around the board
var enemyMethods = {
  moveEnemy : function(){
    d3.selectAll(".enemy")
    .transition()
      .duration(1250)
      .attr("r",function(){return Math.random()*15 + 3;})
      .attr("cx", function(){return Math.random() * options.width;})
      .attr("cy", function(){return Math.random() * options.height;})
      .ease("bounce");
  }
};



// Check for collisions between player and any enemies
//     Current collision detection implementation is inefficient and inaccurate
//     It could be improved by comparing player positions to the line the enemies travel each tick
var checkCollisions = function() {
  var nodes = d3.selectAll(".enemy");
  var player = d3.select(".playerContainer");
  var playerX = 1*player.attr("x") + (player.attr("width") / 2);
  var playerY = 1*player.attr("y") + (player.attr("height") / 2);
  var playerR = 8; // modeling player as circle to simplify calculations
  for (var i = 0; i < nodes.length; i++) {
    var enemy = d3.select(nodes[0][i]);
    var enemyX = enemy.attr("cx");
    var enemyY = enemy.attr("cy");
    var enemyR = enemy.attr("r");
    var distance = Math.sqrt(Math.pow((enemyY - playerY),2) + Math.pow((enemyX - playerX),2));
    console.log(distance);
    if (distance < enemyR + playerR) {
      collide();
    }
  }
};

// On collision, reset score and increase collisions count
var collide = function() {
  console.log("collision!");
  window.stats.current = 0;
  window.collisions++;
  updateScores([stats.current, stats.highScore, stats.collisions]);
};

// Update scores frequently
var updateScores = function(scores){
  d3.selectAll(".scoreboard > div > span")
    .data(scores)
    .text(function(d){
            return d;
          });
};

var updates = function(){
  // No particular reason for 683.
  stats.current += Math.floor(683 * Math.random());
  if(stats.current > stats.highScore){
    stats.highScore = stats.current;
  }
  updateScores([stats.current, stats.highScore, stats.collision]);
};


setInterval(checkCollisions, 10);
setTimeout(function(){return setInterval(updates,300)},3000)
setTimeout(function(){return setInterval(enemyMethods.moveEnemy,1250)}, 1750);
