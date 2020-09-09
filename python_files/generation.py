# from single_network_operation import SingleNet
import warnings
warnings.filterwarnings("ignore", message="numpy.dtype size changed")
warnings.filterwarnings("ignore", message="numpy.ufunc size changed")
from multi_network_operations import MultiNet
import pandas as pd
import networkx as nx
import sys
import json 
import os
import csv
import itertools
from itertools import islice
import operator


#MultiNet Class object Instance
mo_obj = MultiNet()

#Receive the option from the arguments 
option = sys.argv[1]
option = int(option)

### Graph Operations starts here ###

#union
if(option == 0):
	g=nx.Graph()
	result = mo_obj.union(sys.argv[3:])
	if(result == 0):
		sys.exit()
	g.add_weighted_edges_from(result)
	edgelist = g.edges(data=True)

	filename = ''
	for csv_path in sys.argv[3:]:
		filename = filename+csv_path.split("/")[-1].split(".")[0]+ "_"

	# pwd while execution is front 

	dir_name = sys.argv[2]+"/"
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;
	
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	filename=path+filename+"union"+".csv"
	

	fp = open(filename,'wb')
	with open(filename, 'w') as writeFile:
		writer = csv.writer(writeFile,delimiter = ',')
		for i in g.edges(data=True):
			lines=[i[0],i[1],i[2]['weight']['weights']]
			writer.writerow(lines)


#checking for new_year
if(option == -1):
	print os.getcwd();
	os.chdir("../../../../storage")
	print os.getcwd();
	dir_name = "django2";
	path = os.getcwd()+"/"+dir_name;
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)
		print "created_dir";


#intersection
if(option == 333):
	g=nx.Graph()
	result = mo_obj.intersection1(sys.argv[3:])
	if(result == 0):
		sys.exit()
	g.add_nodes_from(result)

	filename = ''
	for csv_path in sys.argv[3:]:
		filename = filename+csv_path.split("/")[-1].split(".")[0]+ "_"

	dir_name = sys.argv[2]+"/"
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;
	
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	filename=path+filename+"intersection"+".csv"

	fp = open(filename,'wb')

	with open(filename,'w') as csv_file:
		writer = csv.writer(csv_file)
		writer.writerows([list(g.nodes())])


#difference
if(option == 222):
	g=nx.Graph()
	result = mo_obj.difference1(sys.argv[3:])
	if(result == 0):
		sys.exit()
	g.add_nodes_from(result)
		
	filename = ''
	for csv_path in sys.argv[3:]:
		filename = filename+csv_path.split("/")[-1].split(".")[0]+ "_"
	
	dir_name = sys.argv[2]+"/"
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;
	
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	filename=path+filename+"difference"+".csv"


	fp = open(filename,'wb')

	with open(filename,'w') as csv_file:
		writer = csv.writer(csv_file)
		writer.writerows([list(g.nodes())])


#community detection with label propagation using async_fluidic 
if(option == 33):
	input1 = sys.argv[2]
	try:
		if(len(sys.argv) < 5):
			k = 10
			iterations = 100
		else:
			k = int(sys.argv[5])
			iterations = int(sys.argv[6])
		community = mo_obj.community_using_async(input1,k,iterations)
	except Exception, e:
		print str(e)
		print "Provide a file for finding the community"
		sys.exit()
	our_communities = sorted(map(sorted,community))

	query=sys.argv[3]
	dir_name = sys.argv[4]+"/"
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;
	
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	filename=path+query+"communities"+".json"


	final_dict = {}
	for i in range(0, len(our_communities)):
		final_dict.update({i:our_communities[i]})

	with open(filename, 'w') as fp:
		json.dump(final_dict, fp, indent=4)



#shortest path 
if(option == 41):
	try:
		shortest_path = mo_obj.path_finding(sys.argv[2],sys.argv[5],sys.argv[6])
		if(shortest_path == -1):
			print "Looked for nodes are not present"
			sys.exit()
		# print shortest_path
	except:
		print "Not a vaild input, Check your inputs"
		sys.exit()

	query=sys.argv[3]
	dir_name = sys.argv[4]+"/"
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;
	
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)


	filename=path+query+"shortestpath"+".csv"
	print filename

	with open(filename,'w') as csv_file:
		writer = csv.writer(csv_file)
		writer.writerows([shortest_path])


#all_simple_paths generation.py 
if(option == 42):
	try:
		all_shortest_path = mo_obj.all_shortest_path(sys.argv[2],sys.argv[5],sys.argv[6])
		if(all_shortest_path == -1):
			print "Looked for nodes are not present"
			sys.exit()
		print "Printing possible shortest path"
	except:
		print "Not a vaild input, Check your inputs"


	query=sys.argv[3]
	dir_name = sys.argv[4]+"/"
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;

	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)


	filename=path+query+"shortestpath"+".csv"
	print "Printing all shortest path"
	all_shortest_path = sorted(map(sorted,all_shortest_path))
	print all_shortest_path
	print "Printing the entire file path"
	print filename

	arr = list(all_shortest_path)

	for i in range(0,len(arr)):
		for j in range(0,len(arr) - i - 1):
			if(len(arr[j]) < len(arr[j+1])):
				temp = arr[j]
				arr[j] = arr[j+1]
				arr[j+1] = temp
	print arr
	with open(filename,'w') as csv_file:
		try:
			writer = csv.writer(csv_file)
			writer.writerows(arr)
		except Exception, e:
				print str(e)



#link prediction with adamic adar with top k
if(option == 999):
	try:
		prediction = mo_obj.adamic_adar_top_k(sys.argv[2], sys.argv[5], sys.argv[6])
		new_list = []
		new_list1 = []
		j=0
		max = -1
		for i in prediction:
			new_list.append(list(i))
			if(new_list[j][2] > max):
				max = max + 1;
			new_list[j][2] = max
			j = j + 1

		for i in new_list:
			new_list1.append(tuple(i))
		
		src = sys.argv[5]

		query=sys.argv[3]
		dir_name = sys.argv[4]+"/"
		os.chdir("storage");
		path = os.getcwd()+"/"+dir_name;
	
		if((os.path.exists(path))):
			pass
		else:
			os.mkdir(path)
			
		filename=path+query+"linkprediction.csv"
		
		with open(filename,'w') as csv_file:
			csv_out=csv.writer(csv_file)
			for row in new_list1:
				csv_out.writerow(row)
	except Exception, e:
		print str(e)



#link prediction with adamic adar with top k
if(option == 786):
	prediction = mo_obj.jtk(sys.argv[2],sys.argv[5], sys.argv[6])

	new_list = []
	new_list1 = []
	j=0
	max = 0
	for i in prediction:
		new_list.append(list(i))
		if(new_list[j][2] > max):
			max = max + 1;
		new_list[j][2] = max
		j = j + 1


	print "After Processing"
	for i in new_list:
		new_list1.append(tuple(i))
	print new_list1
	
	src = sys.argv[3]
	query=sys.argv[3]
	dir_name =sys.argv[4]+"/"

	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;

	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)
		
	filename=path+query+"linkprediction.csv"
	with open(filename,'w') as csv_file:
	    csv_out=csv.writer(csv_file)
	    for row in new_list1:
	        csv_out.writerow(row)

#common neighbours
if(option ==53):
	try:
		g = mo_obj.common_neighbours(sys.argv[2],sys.argv[3],sys.argv[4])
		print type(g)
		src = sys.argv[3]
		dst = sys.argv[4]

		# query="#roshan"
		# dir_name = "osint/"
		# path = "/var/www/html/front-end/storage/"+dir_name
		# print path

		query=sys.argv[3]
		dir_name = sys.argv[4]+"/"
		os.chdir("storage");
		path = os.getcwd()+"/"+dir_name;

		if((os.path.exists(path))):
			print "directory already exists writing to existing directory"
		else:
			os.mkdir(path)
			print "directory created successfully"

		filename=path+query+"common_neighbours"+src+dst+".csv"
		print filename

		with open(filename,'w') as csv_file:
			writer = csv.writer(csv_file)
			writer.writerows([g])
	except:
		print "Error"
		sys.exit()


#degree centrality : Sorted in descending  order 
if(option == 71):
	#try:
		g=nx.Graph()
		mydict = mo_obj.centrality(sys.argv[2])
		result = eval(mydict)

		print result
		sorted_x = sorted(result.items(), key=operator.itemgetter(1),reverse=True)

		query=sys.argv[3]
		dir_name = sys.argv[4]+"/"
		os.chdir("storage");
		path = os.getcwd()+"/"+dir_name;
	
		if((os.path.exists(path))):
			pass
		else:
			os.mkdir(path)

		filename=path+query+"centralities"+".csv"
		print filename

		with open(filename,'w') as csv_file:
			writer = csv.writer(csv_file)
			for row in sorted_x:
				writer.writerow(row)
	#except:
		#print "Error"
		#sys.exit()

#betweeness_centrality : Sorted in desending order 
if(option == 72):
	try:
		betweeness_centrality = mo_obj.betweeness_centrality(sys.argv[2])
		result = eval(betweeness_centrality)

		print result
		sorted_x = sorted(result.items(), key=operator.itemgetter(1),reverse=True)

		query=sys.argv[3]
		dir_name = sys.argv[4]+"/"
		os.chdir("storage");
		path = os.getcwd()+"/"+dir_name;
	
		if((os.path.exists(path))):
			pass
		else:
			os.mkdir(path)

		filename=path+query+"centralities"+".csv"
		print filename

		with open(filename,'w') as csv_file:
			writer = csv.writer(csv_file)
			for row in sorted_x:
				writer.writerow(row)
	except:
		print "Error"
		sys.exit()


#eigen value centrality : Sorted in descending order 
if(option == 73):
	try:
		mydict = mo_obj.eigenvector_centrality(sys.argv[2])
		result = eval(mydict)
		print result
		print type(result)
		print type(mydict)

		print result
		sorted_x = sorted(result.items(), key=operator.itemgetter(1),reverse=True)
		
		query=sys.argv[3]
		dir_name = sys.argv[4]+"/"

		os.chdir("storage");
		path = os.getcwd()+"/"+dir_name;
	
		if((os.path.exists(path))):
			pass
		else:
			os.mkdir(path)

		filename=path+query+"centralities"+".csv"
		print filename

		with open(filename,'w') as csv_file:
			writer = csv.writer(csv_file)
			for row in sorted_x:
				writer.writerow(row)
	except:
		print "Error"
		print "Unable to converge with specified iterations"
		sys.exit()


#centrality: pagerank Sorted in desxending order 
if(option == 74):
	try:
		mydict = mo_obj.pagerank(sys.argv[2])
		result = eval(mydict)
		print result
		print type(result)
		print type(mydict)

		print result
		sorted_x = sorted(result.items(), key=operator.itemgetter(1),reverse=True)

		query=sys.argv[3]
		dir_name = sys.argv[4]+"/"

		os.chdir("storage");
		path = os.getcwd()+"/"+dir_name;
	
		if((os.path.exists(path))):
			pass
		else:
			os.mkdir(path)

		filename=path+query+"centralities"+".csv"
		print filename

		with open(filename,'w') as csv_file:
			writer = csv.writer(csv_file)
			for row in sorted_x:
				writer.writerow(row)
	except:
		print "Error"
		sys.exit()


#community detection with label propagation 
if(option == 501):
	community = mo_obj.label_propagation(sys.argv[2],sys.argv[5])
	our_communities = sorted(map(sorted,community))


	query=sys.argv[3]
	dir_name =sys.argv[4]+"/"

	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;

	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	filename=path+query+"communities"+".json"
	print filename


	final_dict = {}
	for i in range(0, len(our_communities)):
		final_dict.update({i:our_communities[i]})

	with open(filename, 'w') as fp:
		json.dump(final_dict, fp, indent=4)
	# return our_communities


#community detection with grivan newman
if(option == 502):
	try:
		community = mo_obj.grivan(sys.argv[2],sys.argv[7])
	except:
		print "Provide a file for finding the community"
		sys.exit()
	
	our_communities = sorted(map(sorted,community))
	print our_communities
	print len(our_communities)

	query=sys.argv[3]
	dir_name =sys.argv[4]+"/"

	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;

	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	filename=path+query+"communities_grivan"+".csv"
	print filename

	final_dict = {}
	for i in range(0, len(our_communities)):
		final_dict.update({i:our_communities[i]})

	with open(filename, 'w') as fp:
		json.dump(final_dict, fp, indent=4)

if(option == 111):
	print "Hello India"
	all_shortest_path = mo_obj.ksp(sys.argv[2],sys.argv[5],sys.argv[6],sys.argv[7])
	if(all_shortest_path == -1):
		print "Looked for nodes are not present"
		sys.exit()
	print "Printing all shortest_path"
	# print list(all_shortest_path)

	print "Not a vaild input, Check your inputs"

	query=sys.argv[3]
	dir_name =sys.argv[4]+"/"
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;

	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	# print all_shortest_path

	source = sys.argv[3]
	target = sys.argv[4]

	filename=path+query+"shortestpath"+".csv"
	print filename

	with open(filename,'w') as csv_file:
		writer = csv.writer(csv_file)
		writer.writerows(all_shortest_path)

#degree centrality
if(option == 1001):
	try:
		g=nx.Graph()
		mydict = mo_obj.centrality(sys.argv[2])
		result = eval(mydict)
		print result
		sorted_x = sorted(result.items(), key=operator.itemgetter(1),reverse=True)

		query=sys.argv[3]
		dir_name = sys.argv[4]+"/"

		os.chdir("storage");
		path = os.getcwd()+"/"+dir_name;
	
		if((os.path.exists(path))):
			pass
		else:
			os.mkdir(path)



		filename=path+query+"centralities"+".csv"
		print filename

		with open(filename,'w') as csv_file:
			writer = csv.writer(csv_file)
			writer.writerow([])
			for row in sorted_x:
				writer.writerow(row)

	except:
		print "Error"
		sys.exit()



# AS a backup script don't delete 

# with open(filename,'w') as csv_file:
# 	writer = csv.writer(csv_file)
# 	for key, value in result.items():
# 		writer.writerow([key,value])

if(option == 115):
	print "Hello India"

	print sys.argv[2]
	print sys.argv[3]
	print sys.argv[4]
	print sys.argv[5]
	print sys.argv[6]
	print sys.argv[7]

	all_shortest_path = mo_obj.ksp1(sys.argv[2],sys.argv[5],sys.argv[6],sys.argv[7],sys.argv[8])
	
	if(all_shortest_path == -1):
		print "Looked for nodes are not present"
		sys.exit()
	print "Printing all shortest_path"
	# print list(all_shortest_path)

	print "Not a vaild input, Check your inputs"

	query=sys.argv[3]
	dir_name =sys.argv[4]+"/"


	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;
	
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	# print all_shortest_path

	source = sys.argv[3]
	target = sys.argv[4]

	filename=path+query+"shortestpath"+".csv"
	print filename

	with open(filename,'w') as csv_file:
		writer = csv.writer(csv_file)
		writer.writerows(all_shortest_path)




if(option == 404):

	print sys.argv[2]
	print sys.argv[3]
	print sys.argv[4]
	print sys.argv[5]
	print sys.argv[6]
	print sys.argv[7]
	
	all_shortest_path = mo_obj.ksp2(sys.argv[2],sys.argv[5],sys.argv[6],sys.argv[7])
	print list(all_shortest_path)
	
	if(all_shortest_path == -1):
		print "Looked for nodes are not present"
		sys.exit()
	print "Printing all shortest_path"

	print "Not a vaild input, Check your inputs"

	query=sys.argv[3]
	dir_name =sys.argv[4]+"/"

	print "OS.getcwd";
	print os.getcwd();
	os.chdir("storage");
	path = os.getcwd()+"/"+dir_name;
	
	if((os.path.exists(path))):
		pass
	else:
		os.mkdir(path)

	# print all_shortest_path

	source = sys.argv[3]
	target = sys.argv[4]

	filename=path+query+"shortestpath"+".csv"
	print filename

	with open(filename,'w') as csv_file:
		writer = csv.writer(csv_file)
		writer.writerows(all_shortest_path)









	

	












