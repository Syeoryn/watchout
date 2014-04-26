// start slingin' some d3 here.

var options ={
  width : 960,
  height : 750,
  enemies: 42,
  enemyRadius: 10
};

var enemyIds = [];

for(var enemy = 1; enemy <= options.enemies; enemy++){
  enemyIds.push(enemy);
}

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0,options.width]),
  y: d3.scale.linear().domain([0,100]).range([0,options.height])
};

var board = d3.select("body").append("svg")
              .attr("class", "board")
              .style("width", options.width)
              .style("height", options.height)
              .style("background-color", "black");

var enemies = board.selectAll(".enemy")
                   .data(enemyIds,function(id){return id;});

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
       .duration(1000)
       .attr("r",15)
       .attr("stroke-opacity",1)
       .attr("stroke-width",1.1);

enemies.attr("x",function(id){
  return 10 * id;
});


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

setInterval(enemyMethods.moveEnemy,1750);


var playerSpecs = {
  shape: "path",
  path:   "M 9  1"
        + "L 17 26"
        + "L 9  22"
        + "L 1  26"
        + "L 9  1",
  id: 0
};

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
               .attr("fill-opacity",0.25)
             .transition()
               .duration(1000)
               .attr("stroke-opacity",1)
               .attr("stroke-width",2);


var drag = d3.behavior.drag().on("drag",function(e){
  d3.select(this)
    .attr("x",d3.event.x)
    .attr("y",d3.event.y);
});

d3.select(".playerContainer").call(drag);





















