import React, { PureComponent } from 'react';
import d3 from 'd3';
import Sankey from './lib/d3-sankey';
import './style.css';
import Svg from './svg'
/**
 * Main Component
 */
class Main extends PureComponent {
    /**
     * Constructor
     * @param props
     */
    constructor(props){
        super(props);
        this.particles = [];
        this.processEnergyData();
        this.createSankeyInstance();
    }
    static defaultProps = {
        width : 1000,
        height : 1000,
        margin : {
            top : 1,
            bottom : 1,
            left : 1,
            right : 1
        }  ,
        tickTime : 1000
    }
    /**
     * Component Did Mount
     */
    componentDidMount(){

        d3.timer(this.tick.bind(this), this.props.tickTime);
    }
    processEnergyData(){
        const {EnergyData} = this.props;
        EnergyData.links.forEach(function (d) {
            d.o_value = d.value;
            d.value = 1;
        });
        let linkExtent = d3.extent(EnergyData.links, function (d) {return d.o_value});
        let frequencyScale = d3.scale.linear().domain(linkExtent).range([0.05,1]);
        EnergyData.links.forEach(function (link) {
            link.freq = frequencyScale(link.o_value);
            link.particleSize = 2;
            link.particleColor = d3.scale.linear().domain([0,1])
                .range([link.source.color, link.target.color]);
        });

    }
    createSankeyInstance(){
        const {width,height,EnergyData} = this.props;
        const sankey = Sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .size([width, height]);
        sankey
            .nodes(EnergyData.nodes)
            .links(EnergyData.links)
            .layout(32);

        this.sankey = sankey;
    }
    tick(elapsed, time) {
        let _this = this;
        this.particles = this.particles.filter(function (d) {return d.current < d.path.getTotalLength()});
        d3.selectAll("path.link")
            .each(
                function(d) {
                    for (let x = 0;x<2;x++) {
                        let offset = (Math.random() - .5) * (d.dy - 4);
                        if (Math.random() < d.freq) {
                            let length = this.getTotalLength();
                            _this.particles.push({link: d, time: elapsed, offset: offset, path: this, length: length, animateTime: length, speed: 0.5 + (Math.random())})
                        }
                    }
                });

        this.particleEdgeCanvasPath(elapsed);
    }
    particleEdgeCanvasPath(elapsed) {
        let context = d3.select("canvas").node().getContext("2d")

        context.clearRect(0,0,1000,1000);

        context.fillStyle = "gray";
        context.lineWidth = "1px";
        for (let x in this.particles) {
            let currentTime = elapsed - this.particles[x].time;
            this.particles[x].current = currentTime * 0.15 * this.particles[x].speed;
            let currentPos = this.particles[x].path.getPointAtLength(this.particles[x].current);
            context.beginPath();
            context.fillStyle = this.particles[x].link.particleColor(0);
            context.arc(currentPos.x,currentPos.y + this.particles[x].offset,this.particles[x].link.particleSize,0,2*Math.PI);
            context.fill();
        }
    }

    /**
     * Render tge view
     * @returns {XML}
     */
    render() {
        const {width,height,margin,dragAllowed,EnergyData} = this.props;
        return (
            <div style = {{marginTop : 100,marginLeft:100}}>
                <canvas width={width} height={height} ></canvas>
                <Svg
                    width = {width}
                    margin = {margin}
                    height = {height}
                    dragAllowed = {dragAllowed}
                    sankey = {this.sankey}
                    links = {EnergyData.links}
                    nodes = {EnergyData.nodes}

                />
            </div>
        );
    }
}

export default Main;
