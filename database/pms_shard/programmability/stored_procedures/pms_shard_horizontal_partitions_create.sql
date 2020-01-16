Alter Procedure [dbo].[pms_shard_horizontal_partitions_create]
AS
BEGIN
declare @now datetime = GETDATE();
declare @createUpTill datetime =  DATEADD(MONTH,4,@now);
declare @parentId int;
declare @nextFrom datetime;
while((select count(*) from tblHorizontalPartitions where tblHorizontalPartitions.[from]>= @createUpTill)<1)
begin
 select top(1) @parentId = [id], @nextFrom = DATEADD( MONTH, 1, [from]) from tblHorizontalPartitions order by [id] desc;
 if(@parentId is null)
 begin
	set @parentId =0;
	set @nextFrom = @now;
 end
 else
 begin
	if(@nextFrom < @now)
	begin
	set @nextFrom = @now;
	end
	update tblHorizontalPartitions set [to]=@nextFrom where [id]=@parentId;
end
 declare @tableName varchar(100) = 'tblPms_'+Format(@nextFrom, 'ddMMyyyy_HHmmss');

declare @strCreateTable nvarchar(max) ='create table '+@tableName+'(
	[userIdHighest] [int] NOT NULL,
	[userIdLowest] [int] NOT NULL,
	[content] [text] NOT NULL,
	[sentAt] [datetime] NOT NULL,
	[insertedAt] [datetime] NOT NULL,
	[from] [int] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]';
exec sp_executesql @strCreateTable;
declare @strCreateIndices nvarchar(max)='
CREATE CLUSTERED INDEX [IX_'+@tableName+'_insertedAt] ON [dbo].['+@tableName+']
(
	[insertedAt] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
CREATE NONCLUSTERED INDEX [IX_'+@tableName+'_sentAt] ON [dbo].['+@tableName+']
(
	[sentAt] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
CREATE NONCLUSTERED INDEX [IX_'+@tableName+'_userIdHighest] ON [dbo].['+@tableName+']
(
	[userIdHighest] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
CREATE NONCLUSTERED INDEX [IX_'+@tableName+'_userIdLowest] ON [dbo].['+@tableName+']
(
	[userIdLowest] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
';
exec sp_executesql @strCreateIndices;
 insert into tblHorizontalPartitions([from], [tableName], [parentId], [createdAt])
  values(
  @nextFrom, 
  @tableName, 
  @parentId,
  @now
 );
end
END
