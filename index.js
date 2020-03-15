const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const axios = require('axios');


app.post("/find",(req, res)=>{
	 var createCsvWriter = require('csv-writer').createObjectCsvWriter;
    var csvWriter = createCsvWriter({
        path: './csv/file.csv',
        header: [
            {id: 'Non_profit', title: 'profit'},
            {id: 'Donation_Amount', title: 'Donation Currency'},
            {id: 'Donation_Currency', title: 'Donation Amount'},
            {id: 'Fee', title: 'Fee'}

        ]
    });

	let csvToJson = require('convert-csv-to-json');

	let json = csvToJson.getJsonFromCsv('./csv/file.csv')
	    give_india_data = []
	    for(Dict of json){
	        var Dict_keys = Object.keys(Dict)
	        var Dict_values = Object.values(Dict)
	        let new_dict = {}
	        key_list =Dict_keys[0].split(",")
	        value_list = Dict_values[0].split(",")
	        
	        
	        for(var i=0; i<value_list.length ; i++){
	            new_dict[key_list[i]] = value_list[i]
	            
	        }
	        give_india_data.push(new_dict);
	    }
	    res.send(give_india_data)

	var dict = {
		"profit":req.body.Non_profit,
		"DonationAmount":req.body.Donation_Amount,
		"DonationCurrency":req.body.Donation_Currency,
		"Fee":req.body.Fee

	}
	give_india_data.push(dict)
	// res.send(give_india_data)
    var list = []
    for(var users_data of give_india_data){
    	list.push({Non_profit:users_data.profit,Donation_Amount:users_data.DonationAmount,Donation_Currency:users_data.DonationCurrency,Fee:users_data.Fee})
    }
    // res.send(list)	

    csvWriter.writeRecords(list)   
        .then(() => {
            res.send(list);
          });
})



app.get('/status_data/:base',(req, res)=>{
		 axios.get("https://api.exchangeratesapi.io/latest?base="+req.params.base)
		 .then((data)=>{
			var rates = data.data.rates;
			res.send(rates);
		 })
		 .catch((err)=>{
			 res.send("there is some thing error !")
		 })
		 
		
})

app.get("/find_data",(req, res)=>{

	let csvToJson = require('convert-csv-to-json');

	let json = csvToJson.getJsonFromCsv('./csv/sample.csv')
	    give_india_data = []
	    for(Dict of json){
	        var Dict_keys = Object.keys(Dict)
	        var Dict_values = Object.values(Dict)
	        let new_dict = {}
	        key_list =Dict_keys[0].split(",")
	        value_list = Dict_values[0].split(",")
	        
	        
	        for(var i=0; i<value_list.length; i++){
	            new_dict[key_list[i]] = value_list[i]
	            
	        }
	        give_india_data.push(new_dict);
	    }
	    res.send(give_india_data)
})

app.get("/convert_data/:base",(req, res)=>{
	var base = axios.get("https://api.exchangeratesapi.io/latest?base="+req.params.base)
	.then((data)=>{
		let csvToJson = require('convert-csv-to-json');

		let json = csvToJson.getJsonFromCsv('./csv/file.csv')
		give_india_data = []
		for(Dict of json){
			var Dict_keys = Object.keys(Dict)
			var Dict_values = Object.values(Dict)
			let new_dict = {}
			key_list =Dict_keys[0].split(",")
			value_list = Dict_values[0].split(",")
			
			
			for(var i=0; i<value_list.length; i++){
				new_dict[key_list[i]] = value_list[i]
				
			}
			give_india_data.push(new_dict);	
		}

		for(var  i of give_india_data){
			for(var [key,values] of Object.entries(data.data.rates)){
				if(i.DonationCurrency == key){
					i.DonationAmount = i.DonationAmount/values +" "+req.params.base
					
				}
				
			}
		}
		res.send(give_india_data);
	})

})

app.get("/count_data",(req, res)=>{
	let csvToJson = require('convert-csv-to-json');
	let json = csvToJson.getJsonFromCsv('./csv/file.csv')
	give_india_data = []
		for(Dict of json){
			var Dict_keys = Object.keys(Dict)
			var Dict_values = Object.values(Dict)
			let new_dict = {}
			key_list =Dict_keys[0].split(",")
			value_list = Dict_values[0].split(",")
			
			
			for(var i=0; i<value_list.length; i++){
				new_dict[key_list[i]] = value_list[i]
				
			}
			give_india_data.push(new_dict);
			// console.log(give_india_data);
		}
		const result = Object.values(give_india_data.reduce((r, e)=>{
			let k = `${e.profit}|${e.DonationCurrency}|${e.Donation_Amount}|${e.Fee}`;
			if(!r[k]) r[k] = {...e, count:1}
			else r[k].count+=1;
			return r;
		}, {}))
		// res.send(result);
		var new_list = []
		for(let i of result){
			let profit_data = i.profit;
			// console.log(i);
			let total_org_amount_donate = i.count*i.DonationAmount;
			let total_org_fee_data = i.count*i.Fee;
			// console.log(i.profit,i.count*i.DonationAmount,i.count*i.Fee);
			// console.log(profit_data, total_org_amount_donate, total_org_fee_data);
			new_list.push({'profit_data':profit_data,'total_org_amount_donate':total_org_amount_donate,'total_org_fee_data':total_org_fee_data})

		}
		// console.log(new_list);

		const createCsvWriter = require('csv-writer').createObjectCsvWriter;
		const csvWriter = createCsvWriter({
		path: './csv/out.csv',
		header: [
			{id: 'profit_data', title: 'profit_data'},
			{id: 'total_org_amount_donate', title: 'total_org_amount_donate'},
			{id: 'total_org_fee_data', title: 'total_org_fee_data'}
		]
		});

		
		
		
		csvWriter
		.writeRecords(new_list)
		.then(()=> console.log('The CSV file was written successfully'));
			
				
		})


app.listen(4000,()=>{
    console.log('Port is working...')
})
  