import React from 'react';
import './navbar.css';
const Navbar = ({ menuItems }) => {
    return (
        <div>
        <header class="header">
        <nav class="navbar navbar-toggleable-md navbar-light pt-0 pb-0 ">
          <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
          </button>
          <a class="navbar-brand p-0 mr-5" href="#"><img src="http://via.placeholder.com/61x14"/></a>
          <div class="float-left"> <a href="#" class="button-left"><span class="fa fa-fw fa-bars "></span></a> </div>
          <div class="collapse navbar-collapse flex-row-reverse" id="navbarNavDropdown">
            <ul class="navbar-nav">
              <li class="nav-item dropdown messages-menu">
                <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="fa fa-bell-o"></i>
                  <span class="label label-success bg-success">10</span>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <ul class="dropdown-menu-over list-unstyled">
                    <li class="header-ul text-center">You have 4 messages</li>
                    <li>
                      <ul class="menu list-unstyled">
                        <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="http://via.placeholder.com/160x160" class="rounded-circle  " alt="User Image"/>
                          </div>
                          <h4>
                          Support Team
                          <small><i class="fa fa-clock-o"></i> 5 mins</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="http://via.placeholder.com/160x160" class="rounded-circle " alt="User Image"/>
                          </div>
                          <h4>
                          AdminLTE Design Team
                          <small><i class="fa fa-clock-o"></i> 2 hours</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="http://via.placeholder.com/160x160" class="rounded-circle " alt="User Image"/>
                          </div>
                          <h4>
                          Developers
                          <small><i class="fa fa-clock-o"></i> Today</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="http://via.placeholder.com/160x160" class="rounded-circle " alt="User Image"/>
                          </div>
                          <h4>
                          Sales Department
                          <small><i class="fa fa-clock-o"></i> Yesterday</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div class="pull-left">
                            <img src="http://via.placeholder.com/160x160" class="rounded-circle " alt="User Image"/>
                          </div>
                          <h4>
                          Reviewers
                          <small><i class="fa fa-clock-o"></i> 2 days</small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="footer-ul text-center"><a href="#">See All Messages</a></li>
                </ul>
              </div>
            </li>
            <li class="nav-item dropdown notifications-menu">
              <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-envelope-o"></i>
                <span class="label label-warning bg-warning">10</span>
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <ul class="dropdown-menu-over list-unstyled">
                  <li class="header-ul text-center">You have 10 notifications</li>
                  <li>
                    <ul class="menu list-unstyled">
                      <li>
                        <a href="#">
                          <i class="fa fa-users text-aqua"></i> 5 new members joined today
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-warning text-yellow"></i> Very long description here that may not fit into the
                          page and may cause design problems
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-users text-red"></i> 5 new members joined
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-shopping-cart text-green"></i> 25 sales made
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="fa fa-user text-red"></i> You changed your username
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li class="footer-ul text-center"><a href="#">View all</a></li>
                </ul>
              </div>
            </li>
            
            <li class="nav-item dropdown  user-menu">
              <a class="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src="http://via.placeholder.com/160x160" class="user-image" alt="User Image" />
                <span class="hidden-xs">bootstrap develop</span>
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <div class="main">
      <aside>
        <div class="sidebar left ">
          <div class="user-panel">
            <div class="pull-left image">
              <img src="http://via.placeholder.com/160x160" class="rounded-circle" alt="User Image"/>
            </div>
            <div class="pull-left info">
              <p>bootstrap develop</p>
              <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
            </div>
          </div>
          <ul class="list-sidebar bg-defoult">
            <li> <a href="#" data-toggle="collapse" data-target="#dashboard" class="collapsed active" > <i class="fa fa-th-large"></i> <span class="nav-label"> Dashboards </span> <span class="fa fa-chevron-left pull-right"></span> </a>
            <ul class="sub-menu collapse" id="dashboard">
              <li class="active"><a href="#">CSS3 Animation</a></li>
              <li><a href="#">General</a></li>
              <li><a href="#">Buttons</a></li>
              <li><a href="#">Tabs & Accordions</a></li>
              <li><a href="#">Typography</a></li>
              <li><a href="#">FontAwesome</a></li>
              <li><a href="#">Slider</a></li>
              <li><a href="#">Panels</a></li>
              <li><a href="#">Widgets</a></li>
              <li><a href="#">Bootstrap Model</a></li>
            </ul>
          </li>
          <li> <a href="#"><i class="fa fa-diamond"></i> <span class="nav-label">Layouts</span></a> </li>
          <li> <a href="#" data-toggle="collapse" data-target="#products" class="collapsed active" > <i class="fa fa-bar-chart-o"></i> <span class="nav-label">Graphs</span> <span class="fa fa-chevron-left pull-right"></span> </a>
          <ul class="sub-menu collapse" id="products">
            <li class="active"><a href="#">CSS3 Animation</a></li>
            <li><a href="#">General</a></li>
            <li><a href="#">Buttons</a></li>
            <li><a href="#">Tabs & Accordions</a></li>
            <li><a href="#">Typography</a></li>
            <li><a href="#">FontAwesome</a></li>
            <li><a href="#">Slider</a></li>
            <li><a href="#">Panels</a></li>
            <li><a href="#">Widgets</a></li>
            <li><a href="#">Bootstrap Model</a></li>
          </ul>
        </li>
        <li> <a href="#"><i class="fa fa-laptop"></i> <span class="nav-label">Grid options</span></a> </li>
        <li> <a href="#" data-toggle="collapse" data-target="#tables" class="collapsed active" ><i class="fa fa-table"></i> <span class="nav-label">Tables</span><span class="fa fa-chevron-left pull-right"></span></a>
        <ul  class="sub-menu collapse" id="tables" >
          <li><a href=""> Static Tables</a></li>
          <li><a href=""> Data Tables</a></li>
          <li><a href=""> Foo Tables</a></li>
          <li><a href=""> jqGrid</a></li>
        </ul>
      </li>
      <li> <a href="#" data-toggle="collapse" data-target="#e-commerce" class="collapsed active" ><i class="fa fa-shopping-cart"></i> <span class="nav-label">E-commerce</span><span class="fa fa-chevron-left pull-right"></span></a>
      <ul  class="sub-menu collapse" id="e-commerce" >
        <li><a href=""> Products grid</a></li>
        <li><a href=""> Products list</a></li>
        <li><a href="">Product edit</a></li>
        <li><a href=""> Product detail</a></li>
        <li><a href="">Cart</a></li>
        <li><a href=""> Orders</a></li>
        <li><a href=""> Credit Card form</a> </li>
      </ul>
    </li>
    <li> <a href=""><i class="fa fa-pie-chart"></i> <span class="nav-label">Metrics</span> </a></li>
    <li> <a href="#"><i class="fa fa-files-o"></i> <span class="nav-label">Other Pages</span></a> </li>
    <li> <a href="#"><i class="fa fa-files-o"></i> <span class="nav-label">Other Pages</span></a> </li>
    <li> <a href="#"><i class="fa fa-files-o"></i> <span class="nav-label">Other Pages</span></a> </li>
    <li> <a href="#"><i class="fa fa-files-o"></i> <span class="nav-label">Other Pages</span></a> </li>
    <li> <a href="#"><i class="fa fa-files-o"></i> <span class="nav-label">Other Pages</span></a> </li>
  </ul>
  </div>
  </aside>
  </div>

  </div>
    );
};

export default Navbar;
