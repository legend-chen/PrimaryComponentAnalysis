/**
 * Created by legend on 17/01/25.
 */
/*
 * Copyright (C) 2012 Legend Chen.  All rights reserved.
 */
function trace()
{
    console.log.apply(null, arguments);
}

(function (){
    var style = document.createElement("style"),
    styleText = "body {position:absolute; top:0; left:0; right:0; bottom:0; cursor:default}";
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styleText));
    document.getElementsByTagName('head')[0].appendChild(style);
    
    function onReady()
    {
        var clientWidth = document.body.offsetWidth;
        var clientHeight = document.body.offsetHeight;

        //initialize a working canvas to draw Graphics
        stage =
        {
            // canvas: canvas, 
            // graphics: context,
            graphics: new Graphics(clientWidth, clientHeight),
            clientWidth: clientWidth,
            clientHeight: clientHeight,
            centerX: clientWidth >> 1,
            centerY: clientHeight >> 1
        };

        var device = stage.graphics;

        document.body.appendChild(device._canvas);

        document.body.insertAdjacentHTML("beforeBegin", "<div style=\"position:absolute\">" + clientWidth + " × " + clientHeight + "<br />devicePixelRatio = " + devicePixelRatio + "<div>");
        var info = document.body.firstChild;

        stage.trace = function ()
        {
            var text = Array.prototype.slice.call(arguments).toString();
            info.insertAdjacentHTML("beforeEnd", 
"<pre style=font-family:'Monaco';line-height:12px;font-size:12px>" + text + "</pre>");
        
        }

        stage.clear = function ()
        {
            var text = Array.prototype.slice.call(arguments).toString();
            info.innerHTML = "";
        }
    }
    
    window.addEventListener("DOMContentLoaded", onReady);

})();


var stage;
var pVectorsArray = [];

(function(){
        
    var PerfCountFreq   = 30
    var TimeScale       = 1 / PerfCountFreq

    var dBoundarySize       = 200;
    var dDataNumber = 2;


    function Line2Intersection(VertexA, VertexB, VertexC, VertexD)
    {
        var AB = VertexB.Clone().minus(VertexA).Perp();

        var CA = VertexA.Clone().minus(VertexC);

        var CD = VertexD.Clone().minus(VertexC);
        
        //console.log(VertexC, VertexD)
        return CD.multiply(AB.dot(CA) / AB.dot(CD)).plus(VertexC);
    }
    
    for (var i = 0; i < dDataNumber; i++)
    {
        var pData = new Vector2D((Math.random()*2-1) * dBoundarySize,
            (Math.random()*2-1) * dBoundarySize);
        
        pVectorsArray.push(pData);
    }

    var pBoundaryShape = [new Vector2D(-1, -1),
        new Vector2D(-1, 1),
        new Vector2D(1, 1),
        new Vector2D(1, -1)];
    
    
    
    pBoundaryShape.forEach(function (pVertex)
        {
            pVertex.multiply(dBoundarySize);
        });

    var pLineOrigin = new Vector2D(
                (Math.random()*2-1) * dBoundarySize/2, 
                (Math.random()*2-1) * dBoundarySize/2);

    //pLineOrigin.x = 100;
    //pLineOrigin.y = 0;
    
    var pLineDirection = new Vector2D(
            (Math.random()*2-1) * dBoundarySize,
            (Math.random()*2-1) * dBoundarySize);

    var calulator = new PCACoord2Calculator();

    // var linearVector = new Coord2LinearVector();

    var boundaries = new Line2Boundaries(pBoundaryShape);

    var pZero = new Vector2D(0, 0);

    function onRender (time_elapsed)
    {
        var gdi = stage.graphics;

        var pRightShape = [];
        var pLeftShape = [];

        calulator.solveEigen(pVectorsArray, 0, pVectorsArray.length-1);

        // linearVector.solveLinear2(pVectorsArray, 0, pVectorsArray.length-1);

        pLineOrigin.x = calulator._meanX;
        pLineOrigin.y = calulator._meanY;

        pLineDirection.x = calulator.a00;
        pLineDirection.y = calulator.a10;

        var vertexs = boundaries.solveIntersection(pLineOrigin, pLineDirection);

        // var vertexs2 = boundaries.solveIntersection(pZero, new Vector2D(-linearVector.b, linearVector.a));
        // trace(-linearVector.b, linearVector.a)
        var vertexs3 = boundaries.solveIntersection(pLineOrigin, new Vector2D(calulator.a01, calulator.a11));
        
        boundaries._computeBoundaries(pLineOrigin, pLineDirection);

        gdi.clear();

        

        

        gdi.begin();
        gdi.stroke("rgb(0,0,0)", 0);
        gdi.drawClosedShape(boundaries._RightShape);
        gdi.fill("#ffd8d8");
        
        gdi.begin();
        gdi.drawClosedShape(boundaries._LeftShape);
        gdi.fill("#dad8f9");

        
        

        // gdi.begin();
        // gdi.drawLine(vertexs2[0], vertexs2[1]);
        // gdi.stroke("rgb(0,0,255)", 1);

        gdi.begin();
        gdi.drawLine(pLineOrigin, vertexs3[1]);
        gdi.stroke(Vec2DSign(pLineDirection, vertexs3[1].Clone().minus(pLineOrigin))?"#0000FF":"#FF0000", 0.5);
        
        // gdi.stroke("#FF0000", 1);

        gdi.begin();
        gdi.drawLine(vertexs3[0], pLineOrigin);
        gdi.stroke(Vec2DSign(pLineDirection, vertexs3[0].Clone().minus(pLineOrigin))?"#0000FF":"#FF0000", 0.5);
        // gdi.stroke("#0000FF", 1);


        gdi.begin();
        gdi.drawLine(vertexs[0], vertexs[1]);
        gdi.stroke("rgb(255,255,255)", 1.5);


        // trace([vertexs3, vertexs, vertexs2].toString())
        pVectorsArray.forEach(function (Point)
        {
            gdi.begin();
            gdi.drawCircle(Point.x, Point.y, 3);
            gdi.stroke(Vec2DSign(pLineDirection, Point.Clone().minus(pLineOrigin))?"#0000FF":"#FF0000", 1);
        });

        gdi.begin();
        gdi.drawClosedShape(pBoundaryShape);
        gdi.stroke("rgb(0,0,0)", 1);

    }
    
    window.addEventListener("load", onReady);
    
    function onReady(stage)
    {
        var last_timestamp;
        isNeedRedrawing = true;

        function draw(timestamp)
        {
            var time_elapsed = (timestamp - last_timestamp) * TimeScale || 0;
            last_timestamp = timestamp;

            if (isNeedRedrawing)
            {
                onRender(time_elapsed);
                isNeedRedrawing = false;
            }
        
            requestAnimationFrame(draw);
        }
        
        requestAnimationFrame(draw);
    }

    var isCaptured;
    var isNeedRedrawing = true;

    var pMouse = new Vector2D();

    var pSelection;


    function convertToCoordinates(point)
    {
        point.x -= stage.centerX;
        point.y -= stage.centerY;
        point.y = -point.y;
    }

    function onMouseDown(event)
    {
        var clientX = event.clientX;
        var clientY = event.clientY;
        var clientRect = document.body.getBoundingClientRect();

        isCaptured = true;

        pMouse.x = clientX - clientRect.left;
        pMouse.y = clientY - clientRect.top;

        convertToCoordinates(pMouse);

        var isSelected = false;

        for (var i=0; i<pVectorsArray.length; i++)
        {
            var point = pVectorsArray[i];

            var x = point.x - pMouse.x;
            var y = point.y - pMouse.y;
            
            if (x*x+y*y<30)
            {
                isSelected = true;
                pSelection = point;
                break;
            }
        }

        if (!isSelected)
        {
            pSelection = pMouse.Clone();
            pVectorsArray.push(pSelection);
        }
        
        isNeedRedrawing = true;

        event.preventDefault();
    }

    function onMouseMove(event)
    {
        if (isCaptured)
        {
            var clientX = event.clientX;
            var clientY = event.clientY;
            var clientRect = document.body.getBoundingClientRect();

            isCaptured = true;

            pMouse.x = clientX - clientRect.left;
            pMouse.y = clientY - clientRect.top;

            convertToCoordinates(pMouse);

            if (pSelection)
            {
                pSelection.x = pMouse.x;
                pSelection.y = pMouse.y;
                isNeedRedrawing = true;
            }
            event.preventDefault();
        }
    }

    function onMouseUp()
    {
        isCaptured = false;
        pSelection = undefined;
        //vOriginalStagePosition.Copy(pStagePosition);
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    
    
    document.addEventListener("keydown", function (event)
        {
            if (event.keyCode == 68 && event.metaKey)
            {
                disableDefault(event)
//                println("cmd + shirt+ d");
                saveCvs("demo.png", stage.graphics._canvas);
            }
           
        });

    function disableDefault(event)
    {
        event.stopPropagation();
        event.preventDefault();
    };

    function saveCvs (fName, canvas)
    {   
        var url = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");   
        // var url = URL.createObjectURL(new Blob([fBlob], {type:'application/x-download'}));
        var link = document.createElement('a');
        link.href = url;
        link.download = fName;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click');
        link.dispatchEvent(event);
        //URL.revokeObjectURL(url);
    };

})();

// 2015-11-20 foundation of graphics