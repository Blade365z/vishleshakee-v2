<nav class="navbar navbar-expand-lg navbar-light bg-light mb-3 pt-2 px-0">
  <div id="nav-logo">
<a class="navbar-brand" href="home"><img src="public/img/vishnavLogo.png" height="30px" /> </a>
</div>  
<button class="navbar-toggler " type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon "></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav  ml-auto "  id="nav-main-tabs">

     
        @if(Auth::check())
      <li class="nav-item mx-3 borderLeftRight" id="nav-LM">
        <a class="nav-link" href="locationMonitor">Location Monitor</a>
      </li>
      <li class="nav-item mx-3 borderLeftRight  " id="nav-TA">
        <a class="nav-link" href="trendAnalysis">Trend Analysis</a>
      </li>
      <li class="nav-item mx-3 borderLeftRight " id="nav-HA">
        <a class="nav-link" href="historicalAnalysis" >Historical Analysis</a>
      </li>
      <li class="nav-item mx-3 borderLeftRight  " id="nav-NA">
        <a class="nav-link" href="networkAnalysis">Network Analysis</a>
      </li>
      <li class="nav-item mx-3 borderLeftRight " id="nav-UA">
        <a class="nav-link" href="userAnalysis">User Analysis</a>
      </li>
      @endif
 


      <li class="nav-item dropdown  mx-1">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-user-circle" aria-hidden="true"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" href="#">Help</a>
          <a class="dropdown-item" href="https://www.iitg.ac.in/cseweb/osint/smat/" target="_blank">About us</a>
          @if(Auth::check() && Auth::user()->role ==1)
          <a class="dropdown-item" href="register">Register User</a>
          <a class="dropdown-item" href="feedbackPortal">See Feedbacks</a>
          @endif
          @if (Auth::check())
          <div class="dropdown-divider text-center"></div>

          <a href="logout" class="dropdown-item">Logout</a>

          @else
          <div class="dropdown-divider text-center"></div>

          <a href="login" class="dropdown-item">Login</a>

         
          @endif
        </div>
      </li>

    </ul>

  </div>
</nav>