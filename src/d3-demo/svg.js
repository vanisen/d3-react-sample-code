import React, {PureComponent} from 'react';
import d3 from 'd3';
import './style.css';
/**
 * Svg Component
 */
class Main extends PureComponent {
    /**
     * Constructor
     * @param props
     */
    constructor(props) {
        super(props);

    }

    /**
     * Component Did Mount
     */
    componentDidMount() {
        const {dragAllowed,links,nodes,sankey,width,height} = this.props;
        const svg = d3.select(this.svg);
        const path = sankey.link();
        const formatNumber = d3.format(",.0f"),
            format = function(d) { return formatNumber(d) + " TWh"; },
            color = d3.scale.category20();
        let link = svg.append("g").selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", path)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(a, b) { return b.dy - a.dy; });

        link.append("title")
            .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.o_value); });

        let node = svg.append("g").selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .call(d3.behavior.drag()
                .origin(function(d) { return d; })
                .on("dragstart", function() { this.parentNode.appendChild(this); }));

        if(dragAllowed){
            node.on("drag",dragmove)
        }

        node.append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
            .style("stroke", "none")
            .append("title")
            .text(function(d) { return d.name + "\n" + format(d.o_value); });

        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x < width / 2; })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", path);
        }

    }


    /**
     * Render tge view
     * @returns {XML}
     */
    render() {
        const {margin,width,height} = this.props;
        return (
            <svg ref = {(svg)=>this.svg=svg} width={width} height={height} >
                <g transform={"translate(" + margin.left + "," + margin.top + ")"}>
                </g>
            </svg>
        );
    }
}

export default Main;
