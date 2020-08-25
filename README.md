# Earth Obrservation Client
This is a javascript web application used for Earth Oberservation purpose.


# TL;DR
As Earth Observation client, this web app get data from a WMS server and shows them through a map. Techonlogies: REACT and Typescript, Redux as state container, LESS, OpenLayer to implement map and layers, and Proj4js to handle projections.


# Description
## 1. Introduction to WMS
[WMS](https://en.wikipedia.org/wiki/Web_Map_Service) stands for Web Map Service, is a standard protocol developed by OGC (Open Geospatial Consortium) and is used to build maps from geographical information. WMS has the purpose to serve these maps, usually in PNG, GIF, JPEG, SVG format, through XML.

XML response is structured as a list of Layers, and for each one we have plenty information including style, bounding information and many projection. A layer could have many "types of view" called projection which you can see the same information projected on different shapes of the Earh: e.g classic Flat or Sphere way to see Earth This is a list of projections.

## 2. Technologies

* React
* Typescript
* Redux - state container
* LESS - CSS preprocessor
* [OpenLayer](openlayers.org/): library implements map and layers
* [Proj4js](http://proj4js.org/) to transform coordinate system to another

## 3. Front-end Architecture
I used a simple MVC architecture:

#### 3.1 Model
This layer contains the models about WMS standard and the Redux store.

#### 3.2 View
This layer contains the UI: pages and other reusable components like popup.

#### 3.3 Controller
This layer has the purpose to separate the less-direct logic of the page, like logic about layers and projections, as well map initialization.

#### 3.4 Miscellanous
* Types: not part of the WMS data - i.e. the models - like http-response
* Utils: features like full-screen mode and XML Parser
* Services: a class to make REST call
