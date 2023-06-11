// @mui
import { Card } from '@mui/material';
import { Col,Row } from 'react-bootstrap';

export default function AppWidgetSummaryOne({ title, isActive, total, icon, color = 'primary', sx, ...other }) {
  
  return (
    <Card 
      sx={{
        py:2,
        height: '150px',
        boxShadow: 0,        
        textAlign: 'left',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >  
    <Row >
            <Col  md={{ span: 8, offset: 1 }}>
              <Row>
              <h5>{title}</h5>
              </Row>
               
              </Col>
            
          </Row>
    {isActive && Array.isArray(isActive) && isActive.map((option) => {
        return (
          <Row key={option.item1}>
            <Col  md={{ span: 8, offset: 1 }}>
              <Row>
              <h5>{option.item1}</h5>
              </Row>
               
              </Col>
            <Col  ><h5>{option.item2}</h5></Col>
          </Row>          
        )
      })}
      
    </Card>
    
  );
}
