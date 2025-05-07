import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';

const Headtitle = ({ title }) => {
    return (
        <Helmet>
            <title>{`${title}`}</title>
        </Helmet>
    )
}
export default Headtitle;
