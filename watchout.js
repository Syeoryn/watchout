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
