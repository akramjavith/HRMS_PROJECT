<Grid item md={4} xs={12} sm={12}>
    <Box sx={userStyle?.homepagecontainer}>
        <Grid
            container
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Typography variant="h6">This Week Birthdays</Typography>
            <Button
                sx={buttonStyle}
                onClick={() => navigate("/calendarview")}
                onMouseEnter={() => {
                    document.getElementById(
                        "birthday-icon-gif"
                    ).style.visibility = "visible";
                    document.getElementById(
                        "birthday-icon-img"
                    ).style.visibility = "hidden";
                }}
                onMouseLeave={() => {
                    document.getElementById(
                        "birthday-icon-gif"
                    ).style.visibility = "hidden";
                    document.getElementById(
                        "birthday-icon-img"
                    ).style.visibility = "visible";
                }}
            >
                <img
                    id="birthday-icon-img"
                    src={birthdayiconimg}
                    alt="Birthday Icon Image"
                    style={{
                        width: "46px",
                        height: "auto",
                        fontWeight: "bold",
                        visibility: "visible",
                        position: "absolute",
                    }}
                />
                <img
                    id="birthday-icon-gif"
                    src={birthdayicongif}
                    alt="Birthday Icon Gif"
                    style={{
                        width: "46px",
                        height: "auto",
                        fontWeight: "bold",
                        visibility: "hidden",
                        position: "absolute",
                    }}
                />
            </Button>
        </Grid>
        <br />
        <hr />
        <br />
        {true ? (
            <>
                {!noBirthDay ? (
                    <ol>
                        {birthday?.map((item, index) => (
                            <>
                                <Grid container key={index} alignItems="center">
                                    <Grid item xs={8}>
                                        <Typography
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                maxWidth: "100%",
                                            }}
                                            title={item?.companyname}
                                        >
                                            <Link
                                                to={`/birthdaycard/?name=${item?.companyname
                                                    }&id=${item?._id}&status=${true}`}
                                                target="_blank"
                                                style={{
                                                    textDecoration: "none",
                                                    color: "#616161",
                                                }}
                                            >
                                                {index + 1}.{item?.companyname}
                                            </Link>
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={1}>
                                        <Typography>-</Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography>{item?.dob}</Typography>
                                    </Grid>
                                </Grid>
                                <br />
                            </>
                        ))}
                    </ol>
                ) : (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                            }}
                        >
                            <img src={celebration} />

                            <br />
                            <Typography> No Birthdays this Week</Typography>
                        </Box>
                    </>
                )}
            </>
        ) : null}
    </Box>
</Grid>