
			Alter Procedure pms_shard_pms_get(
 @userId1 int,
 @userId2 int,
 @fromInclusive datetime,
 @toExclusive datetime = null
)
AS
BEGIN
	create table #tempPms(
	[userIdHighest] int, [userIdLowest] int, [content] text, [sentAt] datetime, [from] int
	);
	declare @userIdHighest int;
	declare @userIdLowest int;
	if(@userId1 > @userId2)
	begin
	set @userIdHighest  =   @userId1;
	set @userIdLowest  =@userId2;
	end 
	else
	begin
	set @userIdHighest  =   @userId2;
	set @userIdLowest  =@userId1;
	end
	declare @insertedFromInclusive datetime = DATEADD(MINUTE,-3,@fromInclusive);
	declare @insertedToExclusive datetime =@toExclusive;if(@insertedToExclusive > CAST('2019-11-09 13:49:23'as datetime))
			 begin 
			 insert into #tempPms([userIdHighest], [userIdLowest], [content], [sentAt], [from]) select 
 [userIdHighest], [userIdLowest], [content], [sentAt], [from] from tblPms_09112019_134923 where tblPms_09112019_134923.[insertedAt] >= @insertedFromInclusive and tblPms_09112019_134923.[insertedAt] < @insertedToExclusive and tblPms_09112019_134923.[userIdLowest] = @userIdLowest and tblPms_09112019_134923.[userIdHighest] = @userIdHighest and tblPms_09112019_134923.[sentAt] >= @fromInclusive and tblPms_09112019_134923.[sentAt] < @toExclusive end
	 if(@insertedFromInclusive >= CAST('2019-11-09 13:49:23'as datetime))
	 begin
	  return;
	 end;if(@insertedToExclusive > CAST('2019-12-09 13:49:23'as datetime))
			 begin 
			 insert into #tempPms([userIdHighest], [userIdLowest], [content], [sentAt], [from]) select 
 [userIdHighest], [userIdLowest], [content], [sentAt], [from] from tblPms_09122019_134923 where tblPms_09122019_134923.[insertedAt] >= @insertedFromInclusive and tblPms_09122019_134923.[insertedAt] < @insertedToExclusive and tblPms_09122019_134923.[userIdLowest] = @userIdLowest and tblPms_09122019_134923.[userIdHighest] = @userIdHighest and tblPms_09122019_134923.[sentAt] >= @fromInclusive and tblPms_09122019_134923.[sentAt] < @toExclusive end
	 if(@insertedFromInclusive >= CAST('2019-12-09 13:49:23'as datetime))
	 begin
	  return;
	 end;if(@insertedToExclusive > CAST('2020-01-09 13:49:23'as datetime))
			 begin 
			 insert into #tempPms([userIdHighest], [userIdLowest], [content], [sentAt], [from]) select 
 [userIdHighest], [userIdLowest], [content], [sentAt], [from] from tblPms_09012020_134923 where tblPms_09012020_134923.[insertedAt] >= @insertedFromInclusive and tblPms_09012020_134923.[insertedAt] < @insertedToExclusive and tblPms_09012020_134923.[userIdLowest] = @userIdLowest and tblPms_09012020_134923.[userIdHighest] = @userIdHighest and tblPms_09012020_134923.[sentAt] >= @fromInclusive and tblPms_09012020_134923.[sentAt] < @toExclusive end
	 if(@insertedFromInclusive >= CAST('2020-01-09 13:49:23'as datetime))
	 begin
	  return;
	 end;if(@insertedToExclusive > CAST('2020-02-09 13:49:23'as datetime))
			 begin 
			 insert into #tempPms([userIdHighest], [userIdLowest], [content], [sentAt], [from]) select 
 [userIdHighest], [userIdLowest], [content], [sentAt], [from] from tblPms_09022020_134923 where tblPms_09022020_134923.[insertedAt] >= @insertedFromInclusive and tblPms_09022020_134923.[insertedAt] < @insertedToExclusive and tblPms_09022020_134923.[userIdLowest] = @userIdLowest and tblPms_09022020_134923.[userIdHighest] = @userIdHighest and tblPms_09022020_134923.[sentAt] >= @fromInclusive and tblPms_09022020_134923.[sentAt] < @toExclusive end
	 if(@insertedFromInclusive >= CAST('2020-02-09 13:49:23'as datetime))
	 begin
	  return;
	 end;if(@insertedToExclusive > CAST('2020-03-09 13:49:23'as datetime))
			 begin 
			 insert into #tempPms([userIdHighest], [userIdLowest], [content], [sentAt], [from]) select 
 [userIdHighest], [userIdLowest], [content], [sentAt], [from] from tblPms_09032020_134923 where tblPms_09032020_134923.[insertedAt] >= @insertedFromInclusive and tblPms_09032020_134923.[insertedAt] < @insertedToExclusive and tblPms_09032020_134923.[userIdLowest] = @userIdLowest and tblPms_09032020_134923.[userIdHighest] = @userIdHighest and tblPms_09032020_134923.[sentAt] >= @fromInclusive and tblPms_09032020_134923.[sentAt] < @toExclusive end
	 if(@insertedFromInclusive >= CAST('2020-03-09 13:49:23'as datetime))
	 begin
	  return;
	 end;if(@insertedToExclusive > CAST('2020-04-09 13:49:23'as datetime))
			 begin 
			 insert into #tempPms([userIdHighest], [userIdLowest], [content], [sentAt], [from]) select 
 [userIdHighest], [userIdLowest], [content], [sentAt], [from] from tblPms_09042020_134923 where tblPms_09042020_134923.[insertedAt] >= @insertedFromInclusive and tblPms_09042020_134923.[insertedAt] < @insertedToExclusive and tblPms_09042020_134923.[userIdLowest] = @userIdLowest and tblPms_09042020_134923.[userIdHighest] = @userIdHighest and tblPms_09042020_134923.[sentAt] >= @fromInclusive and tblPms_09042020_134923.[sentAt] < @toExclusive end
	 if(@insertedFromInclusive >= CAST('2020-04-09 13:49:23'as datetime))
	 begin
	  return;
	 end;
	select [content] as /*<S_CONTENT>*/'content'/*<S_CONTENT>*/,
	[sentAt] as /*<S_SENT_AT>*/'sentAt'/*<S_SENT_AT>*/, 
	[from] as /*<S_FROM>*/'sentAt'/*<S_FROM>*/ from #tempPms;
END