
var svg = d3.select('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight),
    width = +svg.attr('width'),
    height = +svg.attr('height');

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation().alphaDecay(0.1)
    .force('link', d3.forceLink().id((d) => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

d3.json('../json/virtual_program_structure.json', (error, graph)=>{
    if (error){
        throw error;
    } 
    
    let link = svg.append('g')
            .attr('class', 'links')
        .selectAll('line')
        .data(graph.links)
        .enter()
        .append('line')
            .attr('stroke-width', () => 5);
    let nodes = svg.append('g')
            .attr('class', 'nodes')
        .selectAll('circle')
        .data(graph.nodes)
        .enter()
        .append('circle')
            .attr('r', (d) => d.value * d.value)
            .attr('fill', (d) => color(d.value))
            .call(d3.drag()
                    .on('start', (d) => {
                        if (!d3.event.active) {simulation.alphaTarget(0.3);}
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on('drag', (d) => {
                        d.fx = d3.event.x;
                        d.fy = d3.event.y;
                    })
                    .on('end', (d) => {
                        if (!d3.event.active) {simulation.alphaTarget(0);}
                        d.fx = null;
                        d.fy = null;
                    }));
    nodes.append('title')
        .text((d) => d.id);
    simulation
        .nodes(graph.nodes)
        .on('tick', ticked);
    simulation
        .force("link")
        .links(graph.links);
    function ticked(){
        link
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);
        nodes
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);
    }
});
