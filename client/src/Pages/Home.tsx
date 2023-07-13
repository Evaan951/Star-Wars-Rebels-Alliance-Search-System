import React, { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import globalStyle from '../Styles/global.module.scss'
const Home: React.FC<{}> = () => {

  const naviguate = useNavigate()

  const handleNavigation = (e: MouseEvent<HTMLButtonElement>, to:string)=>{
      naviguate(to)
  }

  return (
    <div className={globalStyle.cardContainer}>
      <div className={globalStyle.card}>
        <p className={globalStyle.cardTitle} >People</p>
        <button className={globalStyle.button} onClick={(e)=> handleNavigation(e,'/people')} >Show more</button>
      </div>
      <div className={globalStyle.card}>
        <p className={globalStyle.cardTitle}>Starships</p>
        <button className={globalStyle.button} onClick={(e)=> handleNavigation(e,'/starships')}>Show more</button>
      </div>
      <div className={globalStyle.card}>
        <p className={globalStyle.cardTitle}>Vehicles</p>
        <button className={globalStyle.button} onClick={(e)=> handleNavigation(e,'/vehicles')}>Show more</button>
      </div>
      <div className={globalStyle.card}>
        <p className={globalStyle.cardTitle}>Planets</p>
        <button className={globalStyle.button} onClick={(e)=> handleNavigation(e,'/planets')}>Show more</button>
      </div>
      <div className={globalStyle.card}>
        <p className={globalStyle.cardTitle}>Species</p>
        <button className={globalStyle.button} onClick={(e)=> handleNavigation(e,'/species')}>Show more</button>
      </div>
      <div className={globalStyle.card}>
        <p className={globalStyle.cardTitle}>Films</p>
        <button className={globalStyle.button} onClick={(e)=> handleNavigation(e,'/films')}>Show more</button>
      </div>
    </div>
  );
};

export default Home