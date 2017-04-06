
var Line2Boundaries = (function()
{
    function rayIntersection(a, b, c, d)
    {
        var r_px = a.x;
        var r_py = a.y;
        // var r_dx = b.x - a.x;
        // var r_dy = b.y - a.y;
        var r_dx = b.x;
        var r_dy = b.y;

        // var c = segment.a;
        // var d = segment.b;

        var s_px = c.x;
        var s_py = c.y;
        var s_dx = d.x - c.x;
        var s_dy = d.y - c.y;

        // SEGMENT in parametric: Point + Delta*T2
        
//        if (r_dx * s_dy - r_dy * s_dx > 0) return;
        
        //Are they parallel? If so, no intersect
        var T0 = r_dy * s_dx - r_dx * s_dy;
        if (T0 == 0) return;

        // Must be within parametic whatevers for RAY/SEGMENT
        var T2 = ((r_px - s_px) * r_dy - (r_py - s_py) * r_dx)/T0;
        if (T2<0 || T2>1) return;
        
        var T1 = ((r_px - s_px) * s_dy - (r_py - s_py) * s_dx)/T0;
        // if (T1 < 0) return;

        return new Vector2D(s_dx * T2 + s_px, s_dy * T2 + s_py);
        // Return the POINT OF INTERSECTION
        // return {
        //     x: s_dx * T2 + s_px,
        //     y: s_dy * T2 + s_py,
        //     delta: T1,
        //     segment: segment
        // }
    }

    function Line2Boundaries(boundaries)
    {
        var _this = this;

        _this._boundaries = boundaries;
    }

    var __proto__ = Line2Boundaries.prototype;

    __proto__.solveIntersection = function (point, direction)
    {
        var _this = this;

        var boundaries = _this._boundaries;
        var vertices = [];

        for (var i = 0, n = boundaries.length; i<n; i++)
        {
            var v1 = boundaries[i];
            var v2 = boundaries[(i + 1) % n];

            var vertex = rayIntersection(point, direction, v1, v2);
            if (vertex)
            {
                vertices.push(vertex);
            }
        }

        return vertices;
    }

    __proto__._computeBoundaries = function (point, direction)
    {
        var _this = this;

        var boundaries = _this._boundaries;

        var pLeftShape = [];
        var pRightShape = [];

        var bFlagStart = direction.x * (boundaries[0].y-point.y) > direction.y * (boundaries[0].x-point.x);

        var bFlagEnd;
        
        for (var i=0, nVertexNum = boundaries.length; i<nVertexNum; i++)
        {
            var pPointStart = boundaries[i];
            var pPointEnd = boundaries[(i+1)%nVertexNum];
            
            bFlagEnd = direction.x * (pPointEnd.y-point.y) > direction.y * (pPointEnd.x-point.x);

            if (bFlagStart)
            {
                pLeftShape.push(pPointStart);
            }
            else
            {
                pRightShape.push(pPointStart);
            }

            if (bFlagStart != bFlagEnd)
            {
                var VertexinLine = rayIntersection(point, direction, pPointStart, pPointEnd);
                
                // console.log(pPointStart, pPointEnd, VertexinLine);
                
                pLeftShape.push(VertexinLine);
                pRightShape.push(VertexinLine);
                bFlagStart = bFlagEnd;
            }
        }
        
        _this._LeftShape = pLeftShape;
        _this._RightShape = pRightShape;

        // console.log(pLeftShape.toString());
        // console.log(pRightShape.toString());

        // return vertices;
    }

    return Line2Boundaries;

})();
