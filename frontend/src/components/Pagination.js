import React from 'react';
import { Box, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { userStyle } from '../pageStyle';

const Pagination = ({ page, pageSize, totalPages, onPageChange, pageItemLength, totalProjects }) => {

    const visiblePages = Math.min(totalPages, 3);
    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];
    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <Box sx={userStyle.dataTablestyle}>
            <Box>
                Showing {pageItemLength > 0 ? (page - 1) * pageSize + 1 : 0} to  {Math.min(page * pageSize, totalProjects)} of {totalProjects} entries
            </Box>
            <Box>
                <Button onClick={() => onPageChange(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                    <FirstPageIcon />
                </Button>
                <Button onClick={() => onPageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                    <NavigateBeforeIcon />
                </Button>
                {pageNumbers.map((pageNumber) => (
                    <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => onPageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                    >
                        {pageNumber}
                    </Button>
                ))}
                {lastVisiblePage < totalPages && <span>...</span>}
                <Button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                    <NavigateNextIcon />
                </Button>
                <Button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                    <LastPageIcon />
                </Button>
            </Box>
        </Box>
    );
};

export default Pagination;