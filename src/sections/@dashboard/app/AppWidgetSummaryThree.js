// @mui
import { Card } from '@mui/material';
import { Col,Row } from 'react-bootstrap';

export default function AppWidgetSummaryThree({ title, isActive, total, icon, color = 'primary', sx, ...other }) {
  
  return (
    <Card 
      sx={{
        py:2,
        height: '150px',
        width:'100%',
        boxShadow: 0,        
        textAlign: 'left',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >  
    {isActive && Array.isArray(isActive) && isActive.map((option) => {
        return (
          <Row key={option.name}>
            <Col   md={{ span: 8, offset: 1 }} >{option.name} </Col>
            <Col >{option.value}</Col>
          </Row>          
        )
      })}
      <Row >
      <Col   md={{ span: 8, offset: 1 }} ><h4 >{title.name}</h4> </Col>
      <Col  ><h4 >{title.value}</h4></Col>
      </Row>
    </Card>
    
  );
}
