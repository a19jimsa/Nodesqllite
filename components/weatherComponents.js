class Button extends React.Component{

    render(){
        return(
            <button>{this.props.children}</button>
        );
    }
}

class Info extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <h1>{this.props.name}</h1>
            <div className="about">{this.props.name}</div>
            <div className="about">{this.props.name}</div>
            <Forecast name={this.props.name} days={this.props.date}/>
            <ChatDialog name={this.props.name}><h1>Väderchatt - {this.props.name}</h1></ChatDialog>
            <WelcomeDialog />
            <ClimateCode />
            <CreateUserDialog />
        </div>;
    }
}

class Forecast extends React.Component{
    constructor(props) {
        super(props);
        this.state = {error: null, isLoaded: false, forecast: []};
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount(){
        await fetch("/forecast/"+this.props.name, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then(result => {
            this.setState({isLoaded: true, forecast: [result]});
            console.log(result);
        },
        (error)=>{
            this.state({isLoaded: true, error});
        })
    }

    handleClick(){
        this.componentDidMount();
    }

    aside(){
        return(
        <aside>
            <button onClick={this.handleClick.bind(this, 1)}>1 dagsprognos</button>
            <button onClick={this.handleClick.bind(this, 3)}>3 dagarsprognos</button>
            <button onClick={this.handleClick.bind(this, 7)}>7 dagarsprognos</button>
        </aside>)
    }

    draw(){
        const {error, isLoaded, forecast} = this.state;
        if(error){
            return <div>Error: {error.message}</div>;
        }else if(!isLoaded){
            return <div>Loading...</div>
        }else if(forecast.length > 0){
            return(
            <div className="flex">
                {this.aside()}
                <div className="forecast">
                    <div><Button value="collapse">Öppna alla</Button><p>Från</p><p>Till</p><p>Temperatur max/min</p><p>Nederbörd per dygn</p><p>Vind/byvind</p></div>
                    {forecast.map(tag =>
                    <div key={tag.name+tag.fromtime+tag.totime}>
                    <Accordion>
                        <div className="infoBox"><h2>{tag.fromtime}</h2><h2>{tag.totime}</h2><h2>{tag.auxdata.TVALUE}&#176;C</h2><h2>{tag.auxdata.RVALUE}{tag.auxdata.RUNIT}</h2><h2>{tag.auxdata.MPS}m/s</h2>
                        </div>
                    </Accordion>
                    </div>
                    )}
                </div>
            </div>)
        }else{
            return <div>Någonting blev fel!</div>
        }
    }

    render(){
        return (
            this.draw()
        );
    }
}

class Accordion extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.setState();
    }

    render() { 
        return <div onClick={this.handleClick} className="toggle">{this.props.children}</div>;
    }
}


class ClimateCode extends React.Component {
    constructor(props) {
        super(props);
        this.getData();
    }
    //Properties specifies here
    //State is an object the component need
    state = {climatecodes: [
    {code: "Af", name: "Tropical rainforest climate Tropical Rainforest", color: "#960000"}]};

    async getData(){
        const response = await fetch("/climatecodes", {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.json()).then(data => {
        this.setState({climatecodes:data})
        console.log(data);
        });
    }

    render() {
        return(
            <table>
                <tbody>
                    {this.state.climatecodes.map(tag =><tr key={tag.code}><td>{tag.code}</td><td>{tag.name}</td><td>{tag.color}</td></tr>)}
                </tbody>
            </table>
        )
    }
}

class WelcomeDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {class: "dialog"};
    }

    handleClick(){
        this.setState({class: "none"});
    }

    render() { 
        return (<Dialog class={this.state.class}><h1>Välkommen till vä'rt!</h1>
        <p>Här kan du följa prognosen för vär't i 1 till 10 dagarsprognos.</p>
        <p>Skriv in vilken ort du vill veta vä'rt!</p>
        <button onClick={this.handleClick}>Tackar!</button>
        </Dialog>)
    }
}

