@extends('parent.app')
@section('content')
    <link href="public/tempCSS/help.css" rel="stylesheet" />
    <div class="container-fluid">
        <div class="text-center">
            <a class="navbar-brand" href="home"><img src="public/img/vishnavLogo.png" height="30px" /> </a>
            <p> Welcome to Vishleshakee help page </p>
        </div>

        <div class="mainHelp">
            <div class="pt-3 pb-1" id="headerHelp">


                <div id="introVish">
                    <div class="text-center">
                        <p class="smat-box-title-large m-0 font-weight-bold p-1"> About Vishleshakee </p>

                    </div>
                    <div>
                        <p class="helpText text-muted">
                            VISHLESHAKEE is a Social Media Analysis Tool developed at Open Source Intelligence Lab, Indian
                            Institute of Technology, Guwahati, India. The tool is developed using open source technologies
                            and uses publicly available data for analysis. The current version 2.0.0 of the tool considers
                            open-sourced <a href="www.twitter.com" target="_blank">Twitter</a> (a social micro-blogging
                            platform) data collected via its provided API as the data source.

                        </p>
                        <p class="helpText text-muted">
                            VISHLESHAKEE acts as a generalized information platform by providing the general public,
                            knowledge about recent topics of discussion on social media. The tool denotes the topics in
                            terms of Twitter hashtags and categorizes them into classes of Trending, Security, and Communal.
                            Also, the associated public sentiments and locations of discussion can be easily visualized from
                            the tool.

                            Besides acting as a generalized information platform VISHLESHAKEE is also empowered with
                            specialized modules for in-depth analysis of various social media contents. Access to such
                            in-depth analysis adds values to the knowledge base of different law enforcement, homeland
                            security, and other relevant agencies about the monitored topic of discussions. The latest
                            version of the tool has 5 such modules, namely:-
                        <ul>
                            <li class="clickable">Location Monitor </li>
                            <li class="clickable">Trend Analysis</li>
                            <li class="clickable">Historical Analysis</li>
                            <li class="clickable">Network Analysis </li>
                            <li class="clickable">User Analysis </li>
                        </ul>
                        </p>
                        <p class="helpText text-muted">
                            VISHLESHAKEE is in its growing phases. With prospects of further addition of much detailed and
                            fine-grained analytical components as a result of research and development activities from the
                            lab, VISHLESHAKEE will emerge as an all-round social media analysis tool.
                        </p>

                    </div>
                </div>

            </div>
            <div id="publicpageHelpMain">
                <div class="smat-box-title-large m-0 font-weight-bold">
                    Trending Page
                </div>
                <div class="helpText">
                    <p class="text-muted m-0"> The Trending Page is for the public as well as for the registered users to
                        analyse upto extent of
                        1Day on any Hashtag and Mention. The dashboard shows realtime analysis for any
                        hashtag/mention such as its frequency distribution plot upto a granularity of 10 seconds,
                        sentiment distribution plot upto a granularity of 10 seconds , the top mentions along with that
                        hashtag/mention , the active users for that hashtag/mention , all the incoming tweets etc.
                        Some more navigations for further analysis is also facilitated for a range of hr. If a user wants
                        to perform analysis for a period more than 1 hr then the user has to register for an account to
                        navigate to the Analysis section of our system. </p>
                    <p class="helpText text-muted">
                                The module provides few visualization for few different analysis namely :-
                    <ul>
                        <li class="m-0">Frequency Distribution </li>
                        <p class="text-muted m-0">The frequency distribution shows the frequency of tweets received for the current hashtag or mentions.The plot shows the incoming traffic (for the selected interval , in the picture it is set to 15mins.) for the tweets based on particular hashtag/mention with a granularity of 10 seconds .Along with the graph it also shows the total number of incoming tweets based on that hashtag/mention and at what time the maximum number of tweets arrived which is updated every 10 seconds</p>
                        <li>Sentiment Distribution</li>
                        <p class="text-muted m-0">The sentiment distribution shows the sentiment of tweets received for the current hashtag or mentions.The plot shows the sentiments i.e postive , negative , neutral (for the selected interval , in the picture it is set to 15mins.) for the tweets based on particular hashtag/mention with a granularity of 10 seconds . Along with the graph the graph also shows the summary information like the percentage of total positive , negative , neutral tweets for a particular interval .</p>
                        <li>Top Co-occur Hashtags</li>
                        <p class="text-muted m-0">The chart shows the unique co-occuring mentions along with Hashtag/Mentions made by the user in the tweet . The chart is sorted in order of their co-occuring frequency . One can analyse the further by clicking on the columns of the chart. (only if the user is registered) .</p>
                        <li>Top Co-occur Mentions</li>
                        <p class="text-muted m-0">The map shows all the locations people are participating from based on the analysed trending hashtag for an interval of time (15mins in the picture) .</p>
                        <li>Top Active Users</li>
                        <p class="text-muted m-0">The chart shows the unique users who has posted on that particular hashtag/mention along with its frequency . The chart is sorted in order of the frequency . One can analyse the user further by clicking on the columns of the chart. (only if the user is registered) .</p>
                        <li>Locations</li>
                        <p class="text-muted m-0">The map shows all the locations people are participating from based on the analysed trending hashtag for an interval of time (15mins in the picture) .</p>

                        <li>Tweet Information</li>

                        <p class="text-muted m-0">User can see the raw tweets posted by people on twitter on that hashtag / mention for a range of interval(15mins in the picture) . One can see the sentiment of the date-time at which the tweet was posted , along with the retweets and quoted tweets by clicking on the  icon .Also the user can redirect to the original tweet on Twitter by clicking on the twitter icon at the bottom of every tweets. A user can also see the sentiment of the tweets on the top near the user name . One can provide sentiment feedback by clicking on "Give Feedback" on dropdown and then a modal will appear to select the actual sentiment/category.</p>

                    </ul>

                    </p>
                </div>
            </div>
        </div>

    </div>


@endsection
