# Axibase - https://axibase.com/

## Clusterability Features
- High Availability
- Scalability
- Load Balancing

## Functions
- INS
- READ
- SCAN
- AVG
- SUM
- CNT
- MAX
- MIN
- UPD
- DEL

## Advanced Functions
- Continuous Calculation
    - In ATSD continuous calculations are implemented in the rule engine using [derived metrics](https://github.com/axibase/atsd/blob/master/rule-engine/derived.md) feature. The rule engine creates sliding data windows in memory and produces new calculated metrics as the underlying metrics arrive. The calculated metrics can be produced with arithmetic formulas, statistical functions, db lookup functions and can join multiple underlying metrics. The frequency of new calculated metrics can be the same as underlying metrics or smaller.
- Tags
- Long-term Storage

## Sampling
- Downsampling

## Smallest Sampling Interval
- 1 ms

## Smallest Storage Granularity
- 1 ms

## Smallest Guaranteed Storage Granularity
- 1 ms

## APIs/Interfaces

- HTTP
- JDBC
- REST
- JSON
- OpenTSDB
- Collectd
- Graphite 
- scollector
- statsD
- tcollector
- Kafka
- UDP
- TelNet

## Client Libraries
- Java
- Python
- R
- PHP
- Ruby
- Node.js
- Go
- ODBC

## Extensibility
- Plugins

## License
- ATSD Community Edition Software License

## Stable Version
- yes
