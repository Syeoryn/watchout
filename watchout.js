// start slingin' some d3 here.

var options ={
  width : window.innerWidth,
  height : window.innerHeight,
  enemies: 25,
  enemyRadius: 25,
  timeFactor: 1.5,
  speed: 2
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
                           .attr("width","28")
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
               .duration(1500*options.timeFactor)
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

var createEnemyPositions = function(){
  var results = [];
  for(var i = 0; i < options.enemies; i++){
    results.push({x: Math.random() * options.width, y: Math.random() * options.height});
  }
  return results;
};

var enemies = board.selectAll(".enemy")
                   .data(createEnemyPositions());

// Add enemies to board
enemies.enter().append("svg:circle")
       .attr("class","enemy")
       .attr("stroke","#00A000")
       .attr("r", 1e-6)
       .attr("stroke-opacity",1e-6)
       .attr("stroke-width", 1e-6)
       .attr("fill","none")
    .transition()
       .duration(1000*options.timeFactor)
       .attr("r",options.enemyRadius)
       .attr("stroke-opacity",1)
       .attr("stroke-width",1.1);



// Allow enemies to move randomly around the board
var enemyMethods = {
  moveEnemy : function(elements){
    elements
    .transition()
      .duration(1250*options.timeFactor)
      .ease("back-up")
      .attr("r",function(){return Math.random()*30 + 3;})
      .attr("cx", function(){return Math.random() * options.width;})
      .attr("cy", function(){return Math.random() * options.height;})
      // .tween("custom", tweenCollision)
      .each('end',function(){enemyMethods.moveEnemy(d3.select(this))})
  }

};



// Check for collisions between player and any enemies
var checkCollisions = function() {
  var collision = false;
  var player = d3.select(".playerContainer");
  var playerX = 1*player.attr("x") + (player.attr("width") / 2);
  var playerY = 1*player.attr("y") + (player.attr("height") / 2);
  var playerR = 8; // modeling player as circle to simplify calculations

  enemies.each(function(){
    var enemyX = 1*d3.select(this).attr("cx");
    var enemyY = 1*d3.select(this).attr("cy");
    var enemyR = 1*d3.select(this).attr("r");
    var distance = Math.sqrt(Math.pow((enemyY - playerY),2) + Math.pow((enemyX - playerX),2));
    if (distance < enemyR + playerR) {
      collision = true;
    }
  });

  if(collision){
    if(prevCollision !== collision){
      stats.current = 0;
      stats.collisions++;
      d3.select('.scoreboard > .collisions > span').text(stats.collisions);
      d3.select('.player').transition().duration(30).attr("transform","rotate(0,14,14)");
      playerContainer.attr("x",options.width/2);
      playerContainer.attr("y",options.height/2);
    }
  }
  prevCollision = collision;
};


var updates = function(){
  // No particular reason for 683.
  stats.current += Math.floor(683 * Math.random());
  stats.highScore = Math.max(stats.highScore,stats.current);

  d3.select('.scoreboard > .current > span').text(stats.current);
  d3.select('.scoreboard > .high > span').text(stats.highScore);
};


setTimeout(function(){return d3.timer(checkCollisions)},3000);

setTimeout(function(){return setInterval(updates,300*options.timeFactor)},3000*options.timeFactor)

setTimeout(function(){return enemyMethods.moveEnemy(enemies)},1250)


// Allow player to be controlled with arrow keys
d3.select('body').on('keydown',function(){
  var x = +playerContainer.attr("x");
  var y = +playerContainer.attr("y");
  var player = d3.select('.player');
  if(d3.event.keyCode === 37){
    //left
    player.transition().duration(30).attr("transform","rotate(270,14,14)");
    playerContainer.transition().duration(500).attr("x",Math.max(x-100*options.speed,0));
  }
  if(d3.event.keyCode === 38){
    //up
    player.transition().duration(30).attr("transform","rotate(0,14,14)");
    playerContainer.transition().duration(500).attr("y",Math.max(y-100*options.speed,0));
  }
  if(d3.event.keyCode === 39){
    //right
    player.transition().duration(30).attr("transform","rotate(90,14,14)");
    playerContainer.transition().duration(500).attr("x",Math.min(x+100*options.speed),options.width);
  }
  if(d3.event.keyCode === 40){
    //down
    player.transition().duration(30).attr("transform","rotate(180,14,14)");
    playerContainer.transition().duration(500).attr("y",Math.min(y+100*options.speed),options.height);
  }
});


