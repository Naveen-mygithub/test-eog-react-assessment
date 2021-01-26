import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import metricData from '../Features/Weather/saga-middle';
import { createClient, Provider, useQuery } from 'urql';
import { Grid, TextField } from '@material-ui/core';
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const queryMetrics = `
query {
  getMetrics
}
`;

const queryTimeStamp = `
query ($input : MeasurementQuery[]) {
  getMultipleMeasurements(input : $input) {
measurements {
  metric
  at
  value
  unit
}
}}
`;

const useStyles = makeStyles((theme) => ({
  card: {
    margin: '5% 25%',
  },
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

const useStylesCard = makeStyles({
  root: {
    width: 10
  },
  pos: {
    marginBottom: 1,
  },
});

export default () => {
  return (
    <Provider value={client}>
      <NowWhat />
    </Provider>
  );
};
interface MeasurementQuery {
  metricName: string;
  after: number;
}
const NowWhat = () => {
  const classes = useStyles();
  const classesCard = useStylesCard();
  const [modifiedMetricsArr, setModifiedMetricsArr] = useState<any[]>();
  const [dataValues, setDataValues] = useState<any[]>();
  const [dataVal, setDataVal] = useState<any[]>(metricData()['data']['getMultipleMeasurements']);


  const [result] = useQuery({
    query: queryMetrics
  });
  // const handleQuery = (measurementQuery : MeasurementQuery[]) => {
  //   const [timeStamp] = useQuery({
  //     query : queryTimeStamp,
  //     variables : {measurementQuery}
  //   });
  //   return timeStamp
  // }
  const { fetching, data, error } = result;
  if (fetching) return <p>Loading...</p>;

  if (error) return <p>Errored!</p>;

  const handleChange = (event: any, value: any, reason: any) => {

    let arr: any[] = [];
    const finalArr: any[] = [];
    for (let val of value) {
      if (val === 'flareTemp') {
        dataVal[0]['measurements'].forEach((val: any, index: number) => {
          finalArr.push({
            "date": val['at'],
            "num": val['value'],
            "pv": val['metric']
          })
        })
      }
      if (val === 'casingPressure') {
        dataVal[1]['measurements'].forEach((val: any, index: number) => {
          finalArr.push({
            "date": val['at'],
            "num": val['value'],
            "uv": val['metric']
          })
        })
      }
      if (val === 'injValveOpen') {
        dataVal[2]['measurements'].forEach((val: any, index: number) => {
          finalArr.push({
            "date": val['at'],
            "num": val['value'],
            "vv": val['metric']
          })
        })
      }
      if (val === 'oilTemp') {
        dataVal[3]['measurements'].forEach((val: any, index: number) => {
          finalArr.push({
            "date": val['at'],
            "num": val['value'],
            "wv": val['metric']
          })
        })
      }
      if (val === 'tubingPressure') {
        dataVal[4]['measurements'].forEach((val: any, index: number) => {
          finalArr.push({
            "date": val['at'],
            "num": val['value'],
            "xv": val['metric']
          })
        })
      }
      if (val === 'waterTemp') {
        dataVal[5]['measurements'].forEach((val: any, index: number) => {
          finalArr.push({
            "date": val['at'],
            "num": val['value'],
            "yv": val['metric']
          })
        })
      }
    }
    if (finalArr.length > 0) {

      setDataValues(finalArr)
    }
    if (value && value.length > 0) {
      value.forEach((val: any, index: number) => {
        arr.push(<div><Card key={index} className={classes.root}>
          <CardContent className={classesCard.root}>
            <Typography variant="h5" component="h2">
              {val}
            </Typography>
            <Typography className={classesCard.pos} color="textSecondary">
              {val === 'flareTemp' ? dataVal[0]['measurements'][0]['value'] : ''}
              {val === 'casingPressure' ? dataVal[1]['measurements'][0]['value'] : ''}
              {val === 'injValveOpen' ? dataVal[2]['measurements'][0]['value'] : ''}
              {val === 'oilTemp' ? dataVal[3]['measurements'][0]['value'] : ''}
              {val === 'tubingPressure' ? dataVal[4]['measurements'][0]['value'] : ''}
              {val === 'waterTemp' ? dataVal[5]['measurements'][0]['value'] : ''}
            </Typography>
          </CardContent>

        </Card><br /></div>)
      })
      if (arr.length > 0) {
        setModifiedMetricsArr(arr)
      }

    }
  }
  return <div style={{ flexGrow: 1 }}>
    <Grid container spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={3} lg={3} md={3}>
          <br />
          {modifiedMetricsArr}
        </Grid>
        <Grid item xs={3} lg={3} md={3}>

        </Grid>
        <Grid item xs={6} lg={6} md={6}>
          <div className={classes.root}>
            <br />
            <Autocomplete
              multiple
              id="tags-outlined"
              options={data.getMetrics}
              getOptionLabel={(option: any) => option}
              filterSelectedOptions
              onChange={handleChange}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="SelectMetrics"
                  placeholder="Select..."
                />
              )}
            />
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={12} md={12}>
        <LineChart width={1000} height={700} data={dataValues}
          margin={{ top: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis dataKey="num" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="num" stroke="#8884d8" />
        </LineChart>
      </Grid>
    </Grid>
  </div>
};

