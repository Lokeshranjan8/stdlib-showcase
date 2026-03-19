import { readFileSync } from 'fs';
import { resolve,dirname } from 'path';
import { fileURLToPath } from 'url';
import normalCDF from '@stdlib/stats-base-dists-normal-cdf';
import * as stats from './Stats.js';

var mean = stats.mean;
var stdev = stats.stdev;

const dir = dirname(fileURLToPath(import.meta.url));

var file = resolve(dir,'../public/data/heart.csv');
var lines = readFileSync( resolve( file ), 'utf8' ).trim().split( '\n' );
var headers = lines[ 0 ].split( ',' ).map( function( h ) {
	return h.trim().toLowerCase();
});


var data = lines.slice( 1 ).map( function( line ) {
	var vals = line.split( ',' );
	var row  = {};
	headers.forEach( function( h, i ) {
		row[ h ] = parseFloat( vals[ i ] );
	});
	return row;
}).filter( function( r ) {
	return !isNaN( r.age );
});



var chol = data.map( function( r ) { return r.chol; } ).filter( function( v ) { return !isNaN( v ); });

var mu  = mean( chol );
var sig = stdev( chol );

var thresholds = [
	{ val: 150, label: 'low (< 150)' },{ val: 200, label: 'healthy (< 200)' },
	{ val: 240, label: 'borderline'},{ val: 280, label: 'high (< 280)'  },
	{ val: 300, label: 'very high (< 300)' }
];

console.log( ' ** Cholesterol Analysis [Normal CDF] ** ' );
console.log( '  mean = ' + mu.toFixed( 1 ) + ' mg/dl,  std = ' + sig.toFixed( 1 ) + '\n' );
console.log( '  normalCDF(threshold, \u03BC, \u03C3)\n' );

thresholds.forEach(t => {
  const p = normalCDF(t.val, mu, sig);
  const bar = '#'.repeat(Math.round(p * 25));
  console.log( `${t.val} mg/dl  ${bar.padEnd(25)}  ${(p * 100).toFixed(1)}%` );
});

console.log('\n')
console.log( ` := ${(normalCDF(200, mu, sig) * 100).toFixed(1)}% have healthy cholesterol (< 200 mg/dl)` );
console.log( ` := ${((1 - normalCDF(240, mu, sig)) * 100).toFixed(1)}% exceed borderline threshold (> 240 mg/dl)` );
console.log( ` := ${((1 - normalCDF(280, mu, sig)) * 100).toFixed(1)}% are in dangerously high range (> 280 mg/dl)` );