import mean      from '@stdlib/stats-strided-mean';
import stdev     from '@stdlib/stats-strided-stdev';
import sqrt      from '@stdlib/math-base-special-sqrt';
import normalCDF from '@stdlib/stats-base-dists-normal-cdf';
import normalPDF from '@stdlib/stats-base-dists-normal-pdf';
import ttest2lib from '@stdlib/stats-ttest2';
import pcorrtesresult from '@stdlib/stats-pcorrtest';


export function mean_arr( arr ) {
    var x = new Float64Array( arr );
    return mean( x.length, x, 1 );
}

export function stdev_arr( arr ) {
    var x = new Float64Array( arr );
    return stdev( x.length, 1, x, 1 );
}


export { normalCDF, normalPDF };


export function zScore( sampleMean, mu0, sigma, n ) {
	return ( sampleMean - mu0 ) / ( sigma / sqrt( n ) );
}
 
export function zPValue( z ) {
    return 1.0 - normalCDF( z, 0.0, 1.0 );
}


export function ttest2(x1, x2) {
  return ttest2lib(x1, x2);
}

export function pcorrtestfn(x,y){
    return pcorrtesresult(x, y, { alternative: 'two-sided' });
}
