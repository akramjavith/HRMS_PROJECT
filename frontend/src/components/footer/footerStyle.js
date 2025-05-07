export const footerStyle = {
    container: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#f3f5fa', // Change this to your preferred background color
        textAlign: 'center !important',
        padding: '5px 0', // Adjust padding as needed
       // boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)', // Optional: adds a slight shadow effect
        zIndex: 1000, // Ensures the footer stays above other elements
        '@media (max-width: 507px)': {
            fontSize: '10px !important',
        },
    },
    hearts: {
        display: 'flex',
        fontWeight: 'bolder !important',
        textAlign: 'center !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        fontSize: '14px !important',
        '@media (max-width: 507px)': {
            fontSize: '10px !important',
        },
    },
};
