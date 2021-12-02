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
        this.state = {isLoaded: true, forecast: [], code: "", date:""};
        this.handleOnChangeCode = this.handleOnChangeCode.bind(this);
        this.handleOnChangeDate = this.handleOnChangeDate.bind(this);
        this.updateClimateCode = this.updateClimateCode.bind(this);
    }

    async updateClimateCode(){
        if(this.state.code != "" && this.state.date != ""){
            await fetch("/forecast/"+this.state.code+"/"+this.state.date, {
            method: 'GET'
            })
            .then((response) => response.json())
            .then(result => {
                this.setState({forecast: result, isLoaded: true});
                console.log(result);
            },
            (error)=>{
                this.setState({isLoaded: false});
            })
        }else{
            alert("Du måste fylla i värden!");
        }
        
    }

    handleOnChangeCode(e){
        this.setState({code: e.target.value});
        console.log(e.target.value);
    }

    handleOnChangeDate(e){
        this.setState({date: e.target.value});
        console.log(e.target.value);
    }
    
    render() {
        if(!this.state.isLoaded){
            return <div>Loading...</div>
        }else{
        return <div>
            <h1>{this.props.name}</h1>
            <div className="about">{this.props.name}</div>
            <Forecast name={this.props.name} days={this.props.date}/>
            <ChatDialog name={this.props.name}><h1>Väderchatt - {this.props.name}</h1></ChatDialog>
            <WelcomeDialog />
            <ClimateCode />
            <div className="about">
                <label>Klimatkod</label>
                <input type="text" onChange={this.handleOnChangeCode} />
                <label>Datum</label>
                <input type="date" onChange={this.handleOnChangeDate} min="2020-01-01" max="2020-12-31"/>
                <button onClick={this.updateClimateCode}>Hämta orter</button>
                <table><thead><tr><th>Namn</th><th>Klimatkod</th><th>Land</th><th>Om</th></tr></thead><tbody>{this.state.forecast.map(tag => <tr key={tag.name}><td>{tag.name}</td><td>{tag.code}</td><td>{tag.country}</td><td>{tag.about}</td></tr>)}</tbody></table>
            </div>
            <CreateUserDialog />
        </div>;
        }
    }
}

class Forecast extends React.Component{
    constructor(props) {
        super(props);
        this.state = {error: null, isLoaded: false, forecast: [], date: "", number: 1};
        this.handleClick = this.handleClick.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.handleOnClickDate = this.handleOnClickDate.bind(this);
    }

    async componentDidMount(){
        await fetch("/forecast/"+this.props.name, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then(result => {
            this.setState({isLoaded: true, forecast: result});
            this.changeForecast();
        },
        (error)=>{
            this.state({isLoaded: true, error});
        })
    }

    async changeForecast(){
        await fetch("/forecast/"+this.props.name+"/"+this.state.date+"?number="+this.state.number, {
            method: 'GET'
        })
        .then((response) => response.json())
        .then(result => {
            this.setState({isLoaded: true, forecast: result});
        },
        (error)=>{
            this.state({isLoaded: true, error});
        })
    }

    handleClick(value){
        this.setState({number: value});
        this.componentDidMount();
    }

    onChangeDate(e){
        this.setState({date: e.target.value});
        console.log(e.target.value);
    }

    handleOnClickDate(){
        this.changeForecast();
    }

    aside(){
        return(
        <aside>
            <button onClick={this.handleClick.bind(this, 1)}>1 dagsprognos</button>
            <button onClick={this.handleClick.bind(this, 3)}>3 dagarsprognos</button>
            <button onClick={this.handleClick.bind(this, 7)}>7 dagarsprognos</button>
            <div>
                <input type="text" onChange={this.onChangeDate} />
                <button onClick={this.handleOnClickDate}>Ändra datum</button>
            </div>
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

class ForecastTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {forecast: []};
    }

    async componentDidMount(){
        
    }

    render() { 
        return <div>
            <table>
                <thead>
                    <th>Väder</th>
                    <th>Nederbörd</th>
                    <th>Vind m/s</th>
                    <th>Känns som C</th>
                    <th>Luftfuktighet</th>
                    <th>Lufttryck hPa</th>
                </thead>
                {this.state.forecast.map(tag => <tbody key={tag.TVALUE}>
                </tbody>)}
            </table>
        </div>;
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
        this.state = {error: null, isLoaded: false, climatecodes: []};
        this.getData();
    }

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
        const {error, isLoaded, climatecodes} = this.state;
        if(error){
            return <div>{error.message}</div>
        }else if(!isLoaded && climatecodes.length <= 0){
            return <div>Loading...</div>
        }else{
            return(
            <table>
                <tbody>
                    {climatecodes.map(tag =><tr key={tag.code}><td>{tag.code}</td><td>{tag.name}</td><td>{tag.color}</td></tr>)}
                </tbody>
            </table>
        )
        }
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
