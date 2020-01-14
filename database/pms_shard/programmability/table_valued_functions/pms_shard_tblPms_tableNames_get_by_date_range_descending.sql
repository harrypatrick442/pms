Alter Function pms_shard_tblPms_tableNames_get_by_date_range_descending (@dateFromInclusive datetime, @dateToExclusive datetime)
RETURNS Table
AS
RETURN
(
select tableName from tblHorizontalPartitions where tblHorizontalPartitions.from >= @dateFromInclusive and tblHorizontalPartitions.from<@dateToExclusive
)
