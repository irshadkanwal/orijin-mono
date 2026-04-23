"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "generatePolygon", {
    enumerable: true,
    get: function() {
        return generatePolygon;
    }
});
const getRandomInt = (min, max)=>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandomPoint = (previousPoint, maxDistance)=>{
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * maxDistance;
    const lat = previousPoint.lat + Math.cos(angle) * distance;
    const long = previousPoint.long + Math.sin(angle) * distance;
    return {
        lat,
        long
    };
};
const generatePolygon = (startingPoint, distanceFromStaringPointVariance, maxDistanceBetweenPoints, minPoints = 5, maxPoints = 8)=>{
    const numPoints = getRandomInt(minPoints, maxPoints);
    const start = getRandomPoint(startingPoint, distanceFromStaringPointVariance);
    const points = [
        start
    ];
    for(let i = 1; i < numPoints; i++){
        const newPoint = getRandomPoint(points[i - 1], maxDistanceBetweenPoints);
        points.push(newPoint);
    }
    return points.map((point)=>[
            point.lat,
            point.long
        ]);
};
