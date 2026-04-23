export interface PolygonWarning {
  key:
    | 'Self-intersects'
    | 'Spikes'
    | 'Out-of-country'
    | 'Not-enough-points'
    | 'First-and-last-point-are-not-equivalent'
    | 'Distance-between-every-point-is-too-large'
    | 'Interaction-polygon-overlapping'
    | 'Area-too-large'
    | 'Area-too-small';
  fixed: boolean;
}
