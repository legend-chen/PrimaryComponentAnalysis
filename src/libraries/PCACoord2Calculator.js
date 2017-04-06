
// PrincipleComponentAnalysis
var PCACoord2Calculator = (function()
{

    function PCACoord2Calculator()
    {
        var _this = this;

        _this.a00 = 0;
        _this.a01 = 0;

        _this.a10 = 0;
        _this.a11 = 0;

        _this._meanX = 0;
        _this._meanY = 0;
    }

    var __proto__ = PCACoord2Calculator.prototype;

    __proto__.solveEigen = function (vertexes, start_of_contour, end_of_contour)
    {
        var _this = this;
        var vertex_number = end_of_contour - start_of_contour + 1;

        var meanX = 0;
        var meanY = 0;

        for (var i = 0, n = vertex_number; i<n; i++)
        {
            var v = vertexes[start_of_contour + i];
            meanX += v.x;
            meanY += v.y;
        }

        meanX /= vertex_number;
        meanY /= vertex_number;

        _this._meanX = meanX;
        _this._meanY = meanY;

        var srow = 1 / Math.sqrt(vertex_number);
        var a00 = a10_01 = a11 = 0;

        for (var i = 0, n = vertex_number; i<n; i++)
        {
            var v = vertexes[start_of_contour + i];
            var x = (v.x - meanX) * srow;
            var y = (v.y - meanY) * srow;

            a00 += x*x;
            a10_01 += x*y;
            a11 += y*y;
        }



        // trace(a1.x, a1.y);
        // trace(b1.x, b1.y);

        // trace(a00, a10_01);
        // trace(a10_01, a11);

        // var delta = (a00+a11)*(a00+a11)-4*(a00*a11-a10_01*a10_01);
        // var d1 = (a00+a11+Math.sqrt(delta))/2;
        // var d2 = (a00+a11-Math.sqrt(delta))/2;

        // var mat = new Mat(2,2);

        // mat.fromArray([ a00, a10_01, 
        //                 a10_01,a11]);

        // var kx = mat._JacobiEquation();

        // var a = Math.atan(a10_01*2/(a00-a11))/2;
        // var cosa = Math.cos(a);
        // var sina = Math.sin(a);
        // var e1 = a00*cosa*cosa+2*a10_01*sina*cosa+a11*sina*sina;
        // var e2 = a00*sina*sina-2*a10_01*sina*cosa+a11*cosa*cosa;

        var x = 2*a10_01;
        if (a00 - a11 < 0) x = -x;
        var y = Math.abs(a00 - a11);
        var w = 1 / Math.sqrt(x*x + y*y);
        var cosa = Math.sqrt(0.5 + 0.5*y*w);
        var sina = 0.5*x*w/cosa;
        var t = (a11-a00)*sina*sina + a10_01*x*w;

        var e1 = a00 + t;
        var e2 = a11 - t;
        // trace(e1, e2);
        // trace(cosa, sina);
        // trace(-sina, cosa);


        if (e1 > e2)
        {
            _this.a00 = cosa;
            _this.a10 = sina;

            _this.a01 = -sina;
            _this.a11 = cosa;
        }
        else
        {
            _this.a00 = -sina;
            _this.a10 = cosa;

            _this.a01 = cosa;
            _this.a11 = sina;
        }

        // trace(_this.a00, _this.a01);
        // trace(_this.a10, _this.a11);

    }

    return PCACoord2Calculator;

})();
